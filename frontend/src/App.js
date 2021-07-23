import React, { useState, useEffect } from 'react';
import './App.css';
import CardView from './CardView';
import Grid from './Grid';
import Accordion from './Accordion';

function App() {
  // const [words, updateWords] = useState([]);
  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch('/words/mandarin/亨特')
  //       .then(function (response) {
  //         // The response is a Response instance.
  //         // You parse the data into a useable format using `.json()`
  //         return response.json();
  //       }).then(function (data) {
  //         // `data` is the parsed version of the JSON returned from the above endpoint.
  //         updateWords(data);
  //         console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
  //       });
  //   }
  //   fetchData();
  // }, []);

  const [articles, updateArticles] = useState([]);
  const [article, updateArticle] = useState([]);
  const [chunks, updateChunks] = useState([]);
  useEffect(() => {
    async function fetchData2() {
      const response = await fetch('/read', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ "url": "https://www.bbc.com/zhongwen/simp/chinese-news-57815871" }) // body data type must match "Content-Type" header
      }).then(function (response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(function (data) {
        console.log("DATA", data);
        // `data` is the parsed version of the JSON returned from the above endpoint.
        updateArticles(data.characters);
        updateArticle(data.article);
        updateChunks(data.another);
        // { "userId": 1, "id": 1, "title": "...", "body": "..." }
      });
    }
    fetchData2();
  }, []);

  return (
    <div className="App">
      <CardView />
      {/* <header className="App-header">
        <p className="App-word-zh">{words.word}</p>
        <p className="App-word">{words.english} </p>
        <p className="App-word">{words.pinyin} </p>
        <FloatingActionButton />
      </header> */}
      <Accordion article={chunks} />
      <Grid characters={articles} />
      {/* {articles.map((char, index) => <div key={index}>{char.character} : {char.pinyin}</div>)} */}
    </div >
  );
}

export default App;
