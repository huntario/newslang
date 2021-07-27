import React from 'react';
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
  return (
    <div className="App">
      <Menu />
      <Switch>
        <Route path="/read">
          <ReadApp />
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
