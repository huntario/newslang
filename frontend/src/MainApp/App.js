import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './Menu';
import ReadApp from '../ReadApp/ReadApp';
import DrillApp from '../DrillApp/DrillApp';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
function App() {
  const [readArticle, updateReadArticle] =
    useState("https://www.bbc.com/zhongwen/simp/chinese-news-57815871");

  function updateURL(url) {
    updateReadArticle(url);
  }
  return (
    <div className="App">
      <Menu updateURL={updateURL} />
      <Switch>
        <Route path="/read">
          <ReadApp article={readArticle} />
        </Route>
        <Route path="/drill">
          <DrillApp />
        </Route>
        <Route path="/progress">
          <p> PROGRESS ROUTE </p>
        </Route>
        <Route path="/test">
          <p> TEST ROUTE </p>
        </Route>
        <Route path="/">
          <Redirect to="/read" />
        </Route>
      </Switch>
    </div >
  );
}
export default App;
