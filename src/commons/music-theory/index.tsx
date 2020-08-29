
import React, { useState } from 'react';
import './MusicTheory.scss';
import { AppVexFlow, Keys } from '../../core/AppVexFlow';
import webMidiService from '../../core/WebMidi.service';

const MusicTheory = (props: any) => {
    const [isRunning, setIsRunning] = useState(true);
    
    let appVexFlow:AppVexFlow;

    const pause = () => {
        setIsRunning(false);
    }

    const run = () => {
        setIsRunning(true);
    };

    React.useEffect(() => {
        appVexFlow = AppVexFlow.from('.mt-container .here', window.screen.width, window.screen.height);
        
        webMidiService.enable().then(() => {
            setTimeout(() => {
                appVexFlow.show({
                    letter:'c',acc:'', octave:'4'
                })
                console.log('add !')
            }, 1000)

            setTimeout(() => {
                /*appVexFlow.withdraw([
                    {
                        letter:'c',acc:'', octave:'4'
                    }
                ])
                console.log('withdraw !')*/
                setIsRunning(false);
            }, 5000)
            
        }).catch(e => console.error(e));

        return () => {
            // unmount
        }
    });

    return (
        <div className="music-theory">
            <div className={`mt-container ${isRunning ? '': 'pause'}`}>
                <div className="limit-bar"></div>
                <div className="here"></div>
                
            </div>
        </div>
    );
}

export default MusicTheory;