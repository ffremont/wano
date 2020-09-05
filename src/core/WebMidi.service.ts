import WebMidi, { InputEventNoteon, InputEventNoteoff, Input } from 'webmidi';
import {Subject, BehaviorSubject} from 'rxjs';

export interface MidiPiano{
    label:string; // name + manufacturer
    id:string;
}

export interface MidiNote{
    code:number;
    name:string;
    octave: number;
}

/**
 * A(la), B(si), C(do), D(ré), E(mi), F(fa), G(sol)
 */
export class WebMidiService {

    public static PIANO_KEYS: string[] = ['C', 'C#', 'D', 'D#','E','F','F#','G','G#','A','A#','B'];

    /**
     * Notes appuyées
     */
    currentNotes:MidiNote[] = [];

    /**
     * 
     */
    noteOnSubject = new Subject<MidiNote[]>();

    /**
     * 
     */
    pianoSubject = new BehaviorSubject<MidiPiano[]>([]);


    /**
     * Liste des pianos connectés
     */
    private pianos:MidiPiano[] = [];

    /**
     * Promise ready
     */
    private ready: Promise<void> = new Promise((resolve, reject) => {
        WebMidi.enable((err) => {
            if (err) {
                reject(err);
            } else {
                WebMidi.addListener("connected", (e)  => {
                    if (e.port.type === 'input') {
                        this.pianos.push({
                            label: `${e.port.name}${e.port.manufacturer ? ' / '+e.port.manufacturer : ''}`,
                            id: e.port.id
                        });
                        this.pianoSubject.next(this.pianos);

                        e.port.addListener("noteon", "all", (event: InputEventNoteon) => {
                            this.noteOn(<Input>(e.port), event);
                        })
                        e.port.addListener("noteoff", "all", (event: InputEventNoteoff) => {
                            this.noteOff(<Input>(e.port), event);
                        })
                    }
                });


                resolve();
            }
        });
    });

    /**
     * Lorsqu'on tape sur la touche
     * @param input 
     * @param event 
     */
    private noteOn(input: Input, event: InputEventNoteon) {
        const code = event.note.octave*WebMidiService.PIANO_KEYS.length + WebMidiService.PIANO_KEYS.indexOf(event.note.name);

        if(!this.currentNotes.some(cNote => cNote.code === code)){
            this.currentNotes.push({
                code, 
                name:event.note.name, 
                octave: event.note.octave
            });

            this.noteOnSubject.next(this.currentNotes.concat([]));
        }
    }

    /**
     *  Lorsqu'on retire son doight de la touche
     * @param input 
     * @param event 
     */
    private noteOff(input: Input, event: InputEventNoteoff) {
        const code = event.note.octave*WebMidiService.PIANO_KEYS.length + WebMidiService.PIANO_KEYS.indexOf(event.note.name);

        const index = this.currentNotes.findIndex(cNote => cNote.code === code);
        if(index > -1){
            this.currentNotes.splice(index, 1);
        }
    }

    enable(): Promise<void> {
        return this.ready;
    }
}

export default new WebMidiService();