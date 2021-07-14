import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import CardView from './CardView';
import FloatingActionButton from './FloatingActionButton';
import Accordion from './Accordion';

function App() {
  const [words, updateWords] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/words/mandarin/亨特')
        .then(function (response) {
          // The response is a Response instance.
          // You parse the data into a useable format using `.json()`
          return response.json();
        }).then(function (data) {
          // `data` is the parsed version of the JSON returned from the above endpoint.
          updateWords(data);
          console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
        });
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>English : {words.english} </p>
        <p>Pinyin : {words.pinyin} </p>
        <p>Mandarin : {words.word} </p>
        <FloatingActionButton />
      </header>
      <Accordion />
      <CardView />
    </div>
  );
}

export default App;
