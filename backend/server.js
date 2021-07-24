require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = process.env.DB_HOST;
const playwright = require('playwright');
const pinyin = require("pinyin");
const nodejieba = require("nodejieba");
const fs = require('fs');
const express = require('express');
const app = express();
const port = 4001;
const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
const hasChinese = (str) => REGEX_CHINESE.test(str);

app.use(express.json()) // for parsing application/json

app.get('/words/:language/:word', (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      await client.connect();
      const database = client.db('language');
      const movies = database.collection(req.params.language);
      const query = { word: req.params.word };
      const movie = await movies.findOne(query);
      console.log(movie);
      res.send(movie)
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
})
app.post('/articles/:language', (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      console.log(req.body)
      // await client.connect();
      // const database = client.db('language');
      // const movies = database.collection(req.body.language);
      // const query = { word: req.params.word };
      // const update = { $set: req.body };
      // const options = { upsert: true };
      // movies.updateOne(query, update, options);
      // const movie = await movies.findOne(query);
      //res.send(movie)
    } finally {
      // Ensures that the client will close when you finish/error
      //await client.close();
    }
  }
  run().catch(console.dir);
})

app.post('/words', (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      console.log(req.body)
      await client.connect();
      const database = client.db('language');
      const movies = database.collection(req.body.language);
      const query = { word: req.params.word };
      const update = { $set: req.body };
      const options = { upsert: true };
      movies.updateOne(query, update, options);
      const movie = await movies.findOne(query);
      res.send(movie)
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
})

app.post('/read', (req, res) => {
  console.log(req.body)
  const vgmUrl = req.body.url;
  (async () => {
    if (!fs.existsSync('./test.html')) {
      const browser = await playwright.chromium.launch();
      const page = await browser.newPage();
      await page.goto(vgmUrl);
      await page.screenshot({ path: 'screenshot.png', fullPage: true });
      const content = await page.content();
      await fs.writeFileSync('test.html', content);
      await browser.close();
    }
    const finalReturn = await runPython();
    //res.send(finalReturn);
  })();
  async function runPython() {
    console.log("runPython()")
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python', ["./test.py"]);
    const finalArray = [];
    pythonProcess.stdout.on('data', async (data) => {
      const characters = [...data.toString('utf-8')];
      finalArray.push(characters);
    });
    pythonProcess.stdout.on('end', async () => {
      const last = await buildResponse(finalArray)
      console.log(last);
      res.send(last)
    });
  }
  async function buildResponse(charac) {
    let articleBody = ['他', '们', '大'];
    // for (y of charac) {
    //   for (i of y) {
    //     const pinyinString = pinyin(i,
    //       {
    //         segement: true,
    //         group: true
    //       }
    //     )
    //     await articleBody.push({ "character": i, "pinyin": pinyinString[0][0] })
    //   }
    // }
    let wordchunks = await chunk(charac);
    let characters = await group(wordchunks);
    let articleResponse = {
      "article": charac,
      "characters": characters,
      "another": wordchunks
    }

    return articleResponse;
  }
  async function group(wordchunks) {
    let chunckedArray = [];
    let cleaned = [];
    // let groups, groupsch;
    for (let i of wordchunks) {
      let groups = i.join('');
      let groupsch = await nodejieba.cut(groups)
      chunckedArray.push(groupsch);
    }

    for (a of chunckedArray) {
      console.log("a", a);
      z = await a.filter((b) => REGEX_CHINESE.test(b));
      console.log("z", z)
      cleaned.push(z);
    }

    return cleaned;
  }

  async function chunk(charac) {
    let re = /[。?？]/;
    let articleChunks = [];
    let articleSentence = [];
    for (y of charac) {
      for (i of y) {
        articleSentence.push(i);
        if (re.exec(i)) {
          await articleChunks.push(articleSentence);
          articleSentence = [];
        }
      }
      console.log("articleChunks", articleChunks);
      return articleChunks;
    }
  }


})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


