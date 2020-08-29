import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './commons/header';
import Player from './pages/Player';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Player></Player>
    </div>
  );
}

export default App;
