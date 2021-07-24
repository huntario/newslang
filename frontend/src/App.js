import React, { useState, useEffect } from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import CardView from './CardView';
import Accordion from './Accordion';

function App() {
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
        return response.json();
      }).then(function (data) {
        console.log("DATA", data);
        updateArticles(data.characters);
        updateArticle(data.article);
        updateChunks(data.another);
      });
    }
    fetchData2();
  }, []);

  return (
    <div className="App">
      <CardView />
      <header className="App-header" >
        {/* {chunks.map((x, index) => <div id={index} className="App-word" >{x}</div>)} */}
        <div id="mainStory" className="App-word" >{chunks}</div>
      </header>
      <Accordion article={chunks} characters={articles} />
      {/* {articles.map((char, index) => <div key={index}>{char.character} : {char.pinyin}</div>)} */}
    </div >
  );
}

export default App;
