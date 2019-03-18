import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';

const hostname = "http://localhost:8888/";
// const port = "8888";

class App extends Component {

  getSmartenderData = async (event) => {
    event.preventDefault();

    await fetch(`${hostname}`)
    .then(response => response.text())
    .then(contents => console.log(contents))
    .catch(() => console.log("Cannot connect, blocked by browser."));
  }

  render() {
    return (
      <div>
        {/* Add components here */}
        <Main />
      </div>
    );
  }
}

export default App;
