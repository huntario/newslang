import React from 'react';
import './DrillApp.css';
import ButtonSave from '../MainApp/ButtonSave';
import ButtonAll from '../MainApp/ButtonAll';
function ReadApp() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="mainStory" className="App-word" >"HEY THERE THIS IS THE DRILL APP WHERE YOU CAN REPEAT SENTENCES AND CARS OVER AND OVER AND OVER AND OVER " </div>
      </header>
      <div style={{ textAlign: 'center', paddingTop: '2em' }}>
        <ButtonSave />
        <ButtonAll />
      </div>
    </div >
  );
}
export default ReadApp;
