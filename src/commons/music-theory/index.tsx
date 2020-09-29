
import React, { useState, useRef } from 'react';
import './MusicTheory.scss';
import { AppVexFlow, Keys } from '../../core/AppVexFlow';
import webMidiService, { MidiNote, MidiPiano } from '../../core/WebMidi.service';
import { Subscription } from 'rxjs';
import randNoteService from '../../core/RandNote.service';

import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slider from '@material-ui/core/Slider';
import { Fab } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgressWithLabel from '../circular-progress-with-label';
import { HumainScore } from '../HumainScore';
import Score from '../score';
import NativeSelect from '@material-ui/core/NativeSelect';
import ReplayIcon from '@material-ui/icons/Replay';
import { LOCAL_STORAGE_CTRL_PREF, LOCAL_STORAGE_SCORES } from '../../App';

interface Expectation {
    notes: number[];
    key: Keys
}

const MusicTheory = (props: any) => {
    const config: any = {
        maxTimeBetweenNote: 3,
        defaultDurationOfExecution: 100,//seconds

        fa: {
            amplitude: {
                min: [30, 52],
                max: [26, 56]
            }
        },
        sol: {
            amplitude: {
                min: [52, 70],
                max: [44, 78]
            }
        }
    };

    const [expanded, setExpanded] = useState(true);
    const [execution, setExecution] = useState(false);
    const [openScore, setOpenScore] = useState(false);
    const [scores, setScores] = useState<HumainScore[]>([]);
    const [duration] = useState(10);
    const [progress, setProgress] = useState(config.defaultDurationOfExecution);
    const [pianos, setPianos] = useState<MidiPiano[]>([]);
    const [piano, setPiano] = useState('');
    const [controls, setControls] = useState({
        speed: 1,
        amplitude: 2,
        repartition: 0,
        chord: 0, // majeur 3-4 et mineur 4-3
    });

    let subNoteOn = useRef<Subscription>();
    let subPiano = useRef<Subscription>();
    let expected = useRef<Expectation[]>([]);
    let scrollIsRunning = useRef<boolean>(true);
    let startExecutionAtTs = useRef<number>(0);
    let goodResponses = useRef<number[]>([]);
    let clockPeriodicTimer: any = useRef();
    let generatorOfNotesPeriodTimer: any = useRef();
    let changeDetectorPeriodTimer: any = useRef();
    let endExecutionTimer: any = useRef();
    let appVexFlow: any = useRef<AppVexFlow>();


    /**
     * Pause du défilement
     */
    const scrollPause = () => {
        if (!scrollIsRunning.current) return;

        console.log('scrollPause !');
        const el: any = document.querySelector('.mt-container');
        el.classList.add('pause');
        scrollIsRunning.current = false;
    }

    /**
     * Lance le défilement des notes
     */
    const scrollPlay = () => {
        console.log('scrollPlay !');
        const el: any = document.querySelector('.mt-container');

        el.classList.remove('pause');
        scrollIsRunning.current = true;
    };

    /**
     * Ajout de notes,
     * Conta
     */
    const generateNotes = () => {
        if (!scrollIsRunning.current) return;
        console.log('generateNotes');

        let solWeight = 0, faWeight = 0;
        if (controls.repartition > 0) {
            // sol
            solWeight = controls.repartition;
        } else if (controls.repartition < 0) {
            // fa
            faWeight = Math.abs(controls.repartition);
        } else {
            solWeight = 1;
            faWeight = solWeight;
        }

        const wantGenerateChord = randNoteService.alea(
            (new Array(controls.chord)).fill('chord')
                .concat((new Array(11 - controls.chord)).fill('note'))
        ) === 'chord';
        const key: any = randNoteService.alea(
            (new Array(solWeight)).fill('sol')
                .concat((new Array(faWeight)).fill('fa'))
        );
        const confKey = config[key.toLowerCase()] || {};

        let notes = [randNoteService.noteBetween(confKey.amplitude.min, confKey.amplitude.max, controls.amplitude / 10)];
        if (wantGenerateChord) {
            const firstNote = randNoteService.noteBetween(confKey.amplitude.min, confKey.amplitude.max, controls.amplitude / 20);
            if (randNoteService.alea(['major', 'minor']) === 'major') {
                notes = [firstNote, firstNote + 3, firstNote + 3 + 4];
            } else {
                notes = [firstNote, firstNote + 4, firstNote + 3 + 4];
            }
        }

        notes.forEach(note => appVexFlow.current.show(note, key === 'sol' ? Keys.SOL : Keys.FA));
        expected.current.push({
            notes,
            key: key === "sol" ? Keys.SOL : Keys.FA
        });
    }

    /**
     * Ms entre 2 notes
     */
    const timelapsBetweenNote = (): number => {
        return config.maxTimeBetweenNote * 1000 * (controls.speed / 11);
    }

    /**
     * Démarre le jeu
     */
    const start = () => {
        (window as any).scroll(0,0);
        startExecutionAtTs.current = (new Date()).getTime();
        goodResponses.current = [];
        expected.current = [];

        setExecution(true);
        setExpanded(false);
        setProgress(config.defaultDurationOfExecution);
        if (localStorage) localStorage.setItem(LOCAL_STORAGE_CTRL_PREF, JSON.stringify(controls));

        endExecutionTimer.current = setTimeout(() => {
            stop();
        }, config.defaultDurationOfExecution * 1000);
        clockPeriodicTimer.current = setInterval(() => {
            setProgress((progress: number) => progress - 1);
        }, 1000);

        scrollPlay();
        generatorOfNotesPeriodTimer.current = setInterval(() => generateNotes(), timelapsBetweenNote())
        changeDetectorPeriodTimer.current = setInterval(() => {
            const nodes: any = document.querySelectorAll('.scroll:not(.hide)') || [];
            if ([...nodes].some(n => n.getBoundingClientRect().x < 122)) {
                scrollPause();
            }
        }, 70);
    }

    /**
     * Arrêt via le bouton stop
     */
    const stop = (force = false) => {
        const deltaTs = (new Date()).getTime() - startExecutionAtTs.current;
        const theoricNumberOfNotes = Math.floor(deltaTs / timelapsBetweenNote());

        if (generatorOfNotesPeriodTimer.current) clearInterval(generatorOfNotesPeriodTimer.current);
        if (clockPeriodicTimer.current) clearInterval(clockPeriodicTimer.current);
        if (changeDetectorPeriodTimer.current) clearInterval(changeDetectorPeriodTimer.current);
        if (endExecutionTimer.current) clearTimeout(endExecutionTimer.current);
        setExecution(false);
        setProgress(0);

        if (!force) {
            const newScores = scores.concat([])
            newScores.unshift({
                at: (new Date()).getTime(),
                value: Math.round((goodResponses.current.length / theoricNumberOfNotes) * 100)
            });
            setScores(newScores);
            setOpenScore(true);

            if (localStorage)
                localStorage.setItem(LOCAL_STORAGE_SCORES, JSON.stringify(newScores));
        }

        appVexFlow.current = AppVexFlow.reset(appVexFlow.current);

        if (props.played) {
            props.played();
        }
    };

    React.useEffect(() => {
        console.log('Mount MusicTheory');
        expected.current = [];
        generatorOfNotesPeriodTimer.current = null;
        changeDetectorPeriodTimer.current = null;
        appVexFlow.current = AppVexFlow.from('.mt-container .here', window.innerWidth, window.innerHeight);
        appVexFlow.current.duration = duration

        if (localStorage && localStorage.getItem(LOCAL_STORAGE_CTRL_PREF))
            setControls(JSON.parse(localStorage.getItem(LOCAL_STORAGE_CTRL_PREF) || '{}'));
        if (localStorage && localStorage.getItem(LOCAL_STORAGE_SCORES))
            setScores(JSON.parse(localStorage.getItem(LOCAL_STORAGE_SCORES) || '[]'));

        subPiano.current = webMidiService.pianoSubject.subscribe((p: MidiPiano[]) => {
            if (props.pianos) {
                props.pianos(p);
            }

            setTimeout(() => setPianos(p), 400);
        });
        subNoteOn.current = webMidiService.noteOnSubject.subscribe((midiNotes: MidiNote[]) => {
            if (!expected.current?.length) return;
            if (expected.current[0].notes.every((n: any) => midiNotes.some(midiNote => midiNote.code === n))) {
                // la liste des touches enfoncées correspond à l'attendu
                console.log('bien joué !');
                let aShift: any = expected.current.shift();
                goodResponses.current.push((new Date()).getTime());
                appVexFlow.current.erase(aShift.notes, aShift.key);
                scrollPlay();
            }
        });
        webMidiService.enable();

        return () => {
            console.log('Unmount MusicTheory');
            subNoteOn.current?.unsubscribe();
            subPiano.current?.unsubscribe();

            const el: any = document.querySelector('.mt-container .here');
            el.innerHTML = '';
            if (generatorOfNotesPeriodTimer.current !== null) clearInterval(generatorOfNotesPeriodTimer.current);
            if (changeDetectorPeriodTimer.current !== null) clearInterval(changeDetectorPeriodTimer.current);
            if (clockPeriodicTimer.current) clearInterval(clockPeriodicTimer.current);

        }
    }, [piano]);

    return (
        <div className="music-theory">
            {(piano === '') && (<div className="piano-selection">
                <FormControl fullWidth>
                    <InputLabel htmlFor="piano-native-helper">Piano</InputLabel>
                    <NativeSelect
                        value={piano}
                        onChange={(e) => {
                            setPiano(`${e.target.value}`);

                        }}
                        inputProps={{
                            name: 'piano',
                            id: 'piano-native-helper',
                        }}
                    >
                        <option aria-label="None" value="" />
                        {pianos.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </NativeSelect>
                    <FormHelperText>liste des périphériques MIDI branchés à votre appareil</FormHelperText>
                </FormControl>
            </div>)}


            {execution && (<div className="time">
                <CircularProgressWithLabel value={progress} />
            </div>)}
            <div className={`mt-container`}>
                <div className="limit-bar"></div>
                <div className="here"></div>

            </div>
            {piano && (<div className="controls">
                <Accordion expanded={expanded} onChange={(e, isExpanded) => setExpanded(isExpanded)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Configuration</Typography>
                    </AccordionSummary>
                    <AccordionDetails className="accordion-details">
                        <div className="control">
                            <Typography id="discrete-slider-speed" gutterBottom>
                                Vitesse
                        </Typography>
                            <Slider
                                value={controls.speed}
                                aria-labelledby="discrete-slider-speed"
                                valueLabelDisplay="auto"
                                step={1}
                                onChange={(e, v: any) => setControls({ ...controls, speed: v })}
                                marks={[{ value: 0, label: 'rapide' }, { value: 5, label: 'normal' }, { value: 10, label: 'lent' }]}
                                min={0}
                                max={10}
                            />

                        </div>
                        <div className="control">
                            <Typography id="discrete-slider-am" gutterBottom>
                                Amplitude des notes
                        </Typography>
                            <Slider
                                value={controls.amplitude}
                                aria-labelledby="discrete-slider-am"
                                valueLabelDisplay="auto"
                                step={1}
                                onChange={(e, v: any) => setControls({ ...controls, amplitude: v })}
                                marks={false}
                                min={0}
                                max={10}
                            />
                        </div>
                        <div className="control">
                            <Typography id="discrete-slider-chord" gutterBottom>
                                Accords
                        </Typography>
                            <Slider
                                value={controls.chord}
                                aria-labelledby="discrete-slider-chord"
                                valueLabelDisplay="auto"

                                step={1}
                                onChange={(e, v: any) => setControls({ ...controls, chord: v })}
                                marks={[{ value: 0, label: 'Peu' }, { value: 10, label: `Beaucoup` }]}
                                min={0}
                                max={10}
                            />
                        </div>

                        <div className="control">
                            <Typography id="discrete-slider-rep" gutterBottom>
                                Répartition main gauche / droite
                        </Typography>
                            <Slider
                                value={controls.repartition}
                                aria-labelledby="discrete-slider-rep"
                                valueLabelDisplay="auto"

                                step={1}
                                onChange={(e, v: any) => setControls({ ...controls, repartition: v })}
                                marks={[{ value: 0, label: 'équitable' }, { value: -5, label: `Gauche` }, { value: 5, label: `Droite` }]}
                                min={-5}
                                max={5}
                            />
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Score open={openScore} scores={scores} onClose={() => setOpenScore(false)}></Score>


                {piano && execution && (<Fab color="secondary" className="app-fab" onClick={() => stop(true)} aria-label="stop">
                    <CloseIcon />
                </Fab>)}
                {piano && !execution && (<Fab color="secondary" className="app-fab" onClick={() => start()} aria-label="play">
                    <PlayArrowIcon />
                </Fab>)}


            </div>)}
            {!piano && (<Fab color="primary" onClick={() => (window as any).location.reload()} className="app-fab">
                <ReplayIcon />
            </Fab>)}
        </div>
    );
}

export default MusicTheory;