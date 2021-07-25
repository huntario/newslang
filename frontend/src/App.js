import React from 'react';
import './App.css';
import CardView from './CardView';
import ReadApp from './ReadApp/ReadApp';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <CardView />
      <Switch>
        <Route path="/read">
          <ReadApp />
        </Route>
        <Route path="/drill">
          <p> DRILL ROUTE </p>
        </Route>
        <Route path="/progress">
          <p> PROGRESS ROUTE </p>
        </Route>
        <Route path="/test">
          <p> PROGRESS ROUTE </p>
        </Route>
        <Route path="/">
          <Redirect to="/read" />
        </Route>
      </Switch>
    </div >
  );
}
export default App;
