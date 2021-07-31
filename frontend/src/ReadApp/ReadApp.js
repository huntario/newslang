import React, { useState, useEffect } from 'react';
import './ReadApp.css';
import Accordion from './Accordion';
import ButtonSave from '../MainApp/ButtonSave';
import ButtonAll from '../MainApp/ButtonAll';
function ReadApp() {
  const [dataReadApp, updatedataReadApp] = useState([]);
  useEffect(() => {
    async function fetchData() {
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
        updatedataReadApp(data);
      });
    }
    fetchData();
  }, []);
  if (dataReadApp) {
    let story = dataReadApp.map((x) => x.mandarin)
    return (
      <div className="App">
        <header className="App-header">
          <div id="mainStory" className="App-word" >{story}</div>
        </header>
        <div style={{ textAlign: 'center', paddingTop: '2em' }}>
          <ButtonSave />
          <ButtonAll />
        </div>
        <Accordion
          data={dataReadApp}
        />
      </div >
    );
  }
  else {
    <p>One moment while the story loads...</p>
  }
}
export default ReadApp;
