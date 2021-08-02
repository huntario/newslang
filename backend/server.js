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
  try {
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
  catch {
    console.log("Dis one no work")
  }
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
  try {
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
  catch {
    console.log("NOT WORKING!!!!")
  }
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
      // let resultLog = `Matches : ${result.matchedCount} \nUpdated : ${result.modifiedCount} \nupsertedCount : ${result.upsertedCount}\n`
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
// async function upsertPageData(url) {
//   const client = new MongoClient(uri);
//   {
//     try {
//       await client.connect();
//       const database = client.db('reads');
//       const movies = database.collection('articles');
//       const query = { url: url }
//       // const result = await movies.findOne(query);
//       const update = { $set: { url: url } }
//       await movies.findOneAndUpdate(query, update, { upsert: true });
//       //, sentence, { upsert: true });
//       // let resultLog = `Matches : ${result.matchedCount} \nUpdated : ${result.modifiedCount} \nupsertedCount : ${result.upsertedCount}\n`
//     }
//     catch (exception_var) {
//       console.log(" CATCH at checkForPageData ", exception_var);
//     }
//     finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
// }
async function checkPageData(url) {
  const client = new MongoClient(uri);
  {
    try {
      await client.connect();
      const database = client.db('reads');
      const movies = database.collection('articles');
      const query = { url: url }
      const result = await movies.findOne(query);
      return result;
    }
    catch (exception_var) {
      console.log(" CATCH at checkForPageData ", exception_var);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}
async function writePageResult(url, pageHTML) {
  const client = new MongoClient(uri);
  {
    try {
      await client.connect();
      const database = client.db('reads');
      const movies = database.collection('articles');
      const query = { url: url }
      const update = { $set: { pageHTML: pageHTML } }
      const result = await movies.findOneAndUpdate(query, update, { upsert: true });
      return result
    }
    catch (exception_var) {
      console.log(" CATCH at checkForPageData ", exception_var);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}
async function writePageCharacterResult(url, characters) {
  const client = new MongoClient(uri);
  {
    try {
      await client.connect();
      const database = client.db('reads');
      const movies = database.collection('articles');
      const query = { url: url }
      const update = { $set: { characters: characters } }
      const result = await movies.findOneAndUpdate(query, update, { upsert: true });
    }
    catch (exception_var) {
      console.log(" CATCH at writePageCharacterResult ", exception_var);
      await writePageCharacterResult(url, characters);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}
async function writeFinalResults(url, final) {
  const client = new MongoClient(uri);
  {
    try {
      await client.connect();
      const database = client.db('reads');
      const movies = database.collection('finals');
      const query = { url: url }
      const update = { $set: { final: final } }
      const result = await movies.findOneAndUpdate(query, update, { upsert: true });
    }
    catch (exception_var) {
      console.log(" CATCH at writePageCharacterResult ", exception_var);
      await writePageCharacterResult(url, characters);
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

async function runPython(res, vgmUrl, text) {
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python', ["test.py", text]);
  const finalArray = [];
  pythonProcess.stdout.on('data', async (data) => {
    const characters = [...data.toString('utf-8')];
    finalArray.push(characters);
  });
  pythonProcess.stdout.on('end', async () => {
    await writePageCharacterResult(vgmUrl, finalArray);
    const last = await buildResponse(finalArray);
    console.log("finalArray : ", finalArray)
    let final = [];
    await last.sentences.map(async (charArray, index) => {
      let section =
      {
        mandarin: charArray.join(''),
        english: null,
        vocab: last.cardUnits[index],
      }
      await final.push(section)
    })
    final.map(async (section) => addSentenceToDatabase(section, 'mandarin-to-english'));
    await writeFinalResults(vgmUrl, final);
    res.send(final);
  })
}
async function quickCheckReturn(url) {
  const client = new MongoClient(uri);
  {
    try {
      await client.connect();
      const database = client.db('reads');
      const movies = database.collection('finals');
      const query = { url: url }
      const result = await movies.findOne(query);
      return result;
    }
    catch (exception_var) {
      console.log(" CATCH at writePageCharacterResult ", exception_var);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}
app.post('/read', async (req, res) => {
  try {
    if (req.body.url) {
      console.log("REQ DOT BODY : ", req.body)
      const vgmUrl = req.body.url;
      const quickCheck = await quickCheckReturn(vgmUrl);
      console.log("quickCheck : ", quickCheck)
      if (quickCheck == null) {
        query = await checkPageData(vgmUrl);
        if (!query) {
          (async () => {
            const browser = await playwright.chromium.launch();
            const page = await browser.newPage();
            await page.goto(vgmUrl);
            await page.screenshot({ path: `./cached-resources/${vgmUrl.replace(/\//g, '-')}-screenshot.png`, fullPage: true });
            const content = await page.content();
            await writePageResult(vgmUrl, content);
            let path = `./cached-resources/${vgmUrl.replace(/\//g, '-')}.html`
            await fs.writeFileSync(path, content);
            await browser.close();
            await runPython(res, vgmUrl, path);
          })();
        }
        else {
          let path = `./cached-resources/${req.body.url.replace(/\//g, '-')}.html`;
          await runPython(res, vgmUrl, path);
        }
      }
      else {
        res.send(quickCheck.final);
        return
      }
    }
    else {
      res.send("You need to submit a URL!!!")
    }
  }
  catch (e) {
    console.log("WELL THAT DIDN't WORK becuase :", e)
  }
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


