require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = process.env.DB_HOST;
const playwright = require('playwright');
const pinyin = require("pinyin");
const fs = require('fs');
const express = require('express')
const app = express()
const port = 4001

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
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto(vgmUrl);
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    const content = await page.content();
    await fs.writeFileSync('test.html', content);
    await browser.close();
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
    let articleBody = [];
    for (y of charac) {
      for (i of y) {
        const pinyinString = pinyin(i,
          {
            segement: true,
            group: true
          }
        )
        await articleBody.push({ "character": i, "pinyin": pinyinString[0][0] })
      }
    }
    //res.send(articleBody);
    return articleBody;
  }
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


