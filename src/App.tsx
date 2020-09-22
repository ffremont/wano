import React, { useState } from 'react';
import './App.css';
import Header from './commons/header';
import Player from './pages/Player';
import Footer from './commons/footer';
import About from './commons/about';
import Soutenir from './commons/soutenir';

function App() {
  const [openAbout, setOpenAbout] = useState(false);
  const [openSoutenir, setOpenSoutenir] = useState(false);

  return (
    <div className="App">
      <Header about={() => setOpenAbout(true)} soutenir={() => setOpenSoutenir(true)} ></Header>
      <Player></Player>

      <About open={openAbout} onClose={() => setOpenAbout(false)}></About>
      <Soutenir open={openSoutenir} onClose={() => setOpenSoutenir(false)}></Soutenir>
      
    </div>
  );
}

export default App;
