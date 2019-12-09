import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import Note from './Note';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {/* <Note 
          id={10101} 
          optionsPage={""} 
          x={30} y={30} 
          defaultTheme='monokai' // maybe allow customizing after i have options_page and DB
          editorFontSize={14} // maybe allow customizing after i have options_page and DB
          editorFontFamily="Consolas, monaco, monospace"
        />  */}
      </div>
    );
  }
}

export default App;
