require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = process.env.DB_HOST;
const playwright = require('playwright');
const pinyin = require("pinyin");
const nodejieba = require("nodejieba");
const dictionary = require('chinese-dictionary');
const fs = require('fs');
const express = require('express');
const app = express();
const compression = require('compression');
const port = 4001;
const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
app.use(express.json()) // for parsing application/json
app.use(compression());
// AUX FUNCTIONS
async function runPython(res) {
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python', ["./test.py"]);
  const finalArray = [];
  pythonProcess.stdout.on('data', async (data) => {
    const characters = [...data.toString('utf-8')];
    finalArray.push(characters);
  });
  pythonProcess.stdout.on('end', async () => {
    const last = await buildResponse(finalArray);
    let final = [];
    await last.sentences.map(async (charArray, index) => {
      let section =
      {
        mandarin: charArray.join(''),
        english: null,
        vocab: last.cardUnits[index]
      }
      await final.push(section)
    })
    // await fs.writeFileSync('./cached-resources/chin.json', JSON.stringify(final));
    res.send(final);
    // await fs.writeFileSync('../frontend/public/cached/ReadAppData.json', JSON.stringify(final));
    final.map(async (section) => addSentenceToDatabase(section, 'mandarin-to-english'));
  })
}
async function buildResponse(charac) {
  let wordchunks = await chunk(charac);
  let characters = await group(wordchunks);
  let pinchars = await addpinyin(characters);
  let withEnglish = await lookupMeaning(pinchars);
  let articleResponse = {
    "sentences": wordchunks,
    "cardUnits": withEnglish
  }
  return articleResponse;
}
async function group(wordchunks) {
  let chunckedArray = [];
  let cleaned = [];
  for (let i of wordchunks) {
    let groups = i.join('');
    let groupsch = await nodejieba.cut(groups)
    chunckedArray.push(groupsch);
  }
  for (a of chunckedArray) {
    z = await a.filter((b) => REGEX_CHINESE.test(b));
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
    return articleChunks;
  }
}
async function addpinyin(characterArray) {
  let re = /[。?？]/;
  let sentences = [];
  for (y of characterArray) {
    let wordchunks = [];
    for (i of y) {
      let pinyins = await pinyin(i, { segment: true, group: true })
      await wordchunks.push({ character: i, pinyin: pinyins[0][0] })
    }
    sentences.push(wordchunks)
  }
  return sentences;
}
async function lookupMeaning(characterArray) {
  let complete = []
  await dictionary.init().then(async () => {
    for (y of characterArray) {
      let sentences = [];
      for (i of y) {
        h = {
          characters: i.character,
          pinyin: i.pinyin,
          english: []
        };
        await dictionary.query(i.character).then(async (result) => {
          for (a of result) {
            h.english.push(...a.english)
          }
        });
        sentences.push(h);
      };
      complete.push(sentences)
    };
  });
  return complete;
}
async function addSentenceToDatabase(sentence, language) {
  const client = new MongoClient(uri);
  {
    try {
      await client.connect();
      const database = client.db('language');
      const movies = database.collection(language);
      const query = { mandarin: sentence.mandarin }
      // const result = await movies.findOne(query);
      const result = await movies.updateOne(query, { $set: sentence }, { upsert: true });
      //, sentence, { upsert: true });
      let resultLog = `Matches : ${result.matchedCount} \nUpdated : ${result.modifiedCount} \nupsertedCount : ${result.upsertedCount}\n`
      console.log(resultLog);
    }
    catch (exception_var) {
      console.log(" CATCH at addSentenceToDatabase ", exception_var);
      await addSentenceToDatabase(sentence, language)
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}
// ROUTES
app.get('/words/:language/:word', (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      await client.connect();
      const database = client.db('language');
      const movies = database.collection(req.params.language);
      const query = { word: req.params.word };
      const movie = await movies.findOne(query);
      res.send(movie)
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
})
app.post('/words', (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
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
app.post('/read', async (req, res) => {
  const vgmUrl = req.body.url;
  if (!fs.existsSync('./cached-resources/chin.json')) {
    (async () => {
      //if (!fs.existsSync('./test.html')) {
      const browser = await playwright.chromium.launch();
      const page = await browser.newPage();
      await page.goto(vgmUrl);
      await page.screenshot({ path: './cached-resources/screenshot.png', fullPage: true });
      const content = await page.content();
      await fs.writeFileSync('./cached-resources/test.html', content);
      await browser.close();
      //}
      const finalReturn = await runPython(res);
    })();
  }
  else {
    let rawFile = fs.readFileSync('./cached-resources/chin.json');
    let jsonFile = JSON.parse(rawFile);
    res.send(jsonFile);
  }
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


