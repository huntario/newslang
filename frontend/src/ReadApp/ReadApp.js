import React, { useState, useEffect } from 'react';
import './ReadApp.css';
import CardView from '../CardView';
import Accordion from './Accordion';
function ReadApp() {
  const [frontEndData, updatefrontEndData] = useState([]);
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
        updatefrontEndData(data);
      });
    }
    fetchData2();
  }, []);

  return (
    <div className="App">
      <CardView />
      <header className="App-header">
        <div id="mainStory" className="App-word" >{frontEndData.article}</div>
      </header>
      <Accordion
        sentences={frontEndData.sentences}
        withPinyin={frontEndData.pinchars}
        withEnglish={frontEndData.withEnglish}
      />
    </div >
  );
}
export default ReadApp;