import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Nav from './options_page/Nav.js';


class App extends Component {
  render() {
    return (
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h1 className="App-title">Welcome to React</h1>
      //   </header>
      //   <p className="App-intro">
      //     To get started, edit <code>src/App.js</code> and save to reload.
      //   </p>
      // </div>
      // <Switch>
      //     <Route exact path="/">
      //       <Home />
      //     </Route>
      //     <Route path="/about">
      //       <About />
      //     </Route>
      //     <Route path="/dashboard">
      //       <Dashboard />
      //     </Route>
      //   </Switch>
      // </div>
      <Nav />
    );
  }
}

export default App;
