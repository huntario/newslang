import React, { useState, useEffect } from 'react';
import './App.css';
import CardView from './CardView';
import Accordion from './Accordion';

function App() {
  const [frontEndData, updateData] = useState([]);
  useEffect(() => {
    async function fetchData2() {
      await fetch('/read', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ "url": "https://www.bbc.com/zhongwen/simp/chinese-news-57815871" })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log("DATA", data);
        updateData(data);
      });
    }
    fetchData2();
  }, []);

  return (
    <div className="App">
      {/* {console.log("frontEndData ", frontEndData)} */}
      <CardView />
      <header className="App-header" >
        {/* {chunks.map((x, index) => <div id={index} className="App-word" >{x}</div>)} */}
        <div id="mainStory" className="App-word" >{frontEndData.article}</div>
      </header>
      <Accordion sentences={frontEndData.sentences} withPinyin={frontEndData.pinchars} />
    </div >
  );
}
export default App;
