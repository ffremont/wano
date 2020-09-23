import React, { useState } from 'react';
import './App.css';
import Header from './commons/header';
import Player from './pages/Player';
import About from './commons/about';
import Soutenir from './commons/soutenir';
import Score from './commons/score';
import Plug from './commons/plug';

function App() {
  const [openAbout, setOpenAbout] = useState(false);
  const [openSoutenir, setOpenSoutenir] = useState(false);
  const [openScore, setOpenScore] = useState(false);
  const [openPlug, setOpenPlug] = useState(true);
  const [scores, setScores] = useState([]);

  const loadScore = () => {
    if (localStorage && localStorage.getItem(LOCAL_STORAGE_SCORES))
            setScores(JSON.parse(localStorage.getItem(LOCAL_STORAGE_SCORES) || '[]'));
  }

  React.useEffect(() => {
    loadScore();
  }, [openAbout, openSoutenir, openScore]);
  return (
    <div className="App">
      <Header 
        about={() => setOpenAbout(true)} 
        soutenir={() => setOpenSoutenir(true)}
        scores={() => setOpenScore(true)} 
        reset={() => loadScore()}
        ></Header>

      <Player played={() => loadScore()} pianos={(pianos:any) => pianos.length > 0 ? setOpenPlug(false) : setOpenPlug(true)}></Player>

      <Plug open={openPlug} onClose={() => setOpenPlug(false)}></Plug>
      <About open={openAbout} onClose={() => setOpenAbout(false)}></About>
      <Score open={openScore} scores={scores} onClose={() => setOpenScore(false)}></Score>
      <Soutenir open={openSoutenir} onClose={() => setOpenSoutenir(false)}></Soutenir>
      
    </div>
  );
}

export const LOCAL_STORAGE_SCORES = 'wano-scores';
export const LOCAL_STORAGE_CTRL_PREF = 'wano-controls-prefs';

export default App;
