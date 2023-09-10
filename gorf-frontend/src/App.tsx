import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function testRequest(): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fetch('google.com').then(response => response.text()))
    }
    , 5000)
  })   
}

function App() {
  const [test, setTest] = useState(null);
  testRequest().then(setTest);

  return (
    <div className="App">
      <span>2</span>
      <span>{test}</span>       
    </div>
  );
}

export default App;
