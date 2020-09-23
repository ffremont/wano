
import React from 'react';
import MusicTheory from '../../commons/music-theory';

const Player = (props: any) => {
    
  return (
     <div>
       <MusicTheory pianos={(p:any) => props.pianos(p)}></MusicTheory>
     </div>
  );
}

export default Player;