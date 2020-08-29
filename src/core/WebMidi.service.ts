import WebMidi, { InputEventNoteon, InputEventNoteoff, Input } from 'webmidi';

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
class WebMidiService {

    pianoKeys: string[] = ['C', 'C#', 'D', 'D#','E','F','F#','G','G#','A','A#','B']

    /**
     * Notes appuyées
     */
    currentNotes:MidiNote[] = [];

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
                            label: `${e.port.name} / ${e.port.manufacturer}`,
                            id: e.port.id
                        });
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

    getPianos() : MidiPiano[]{
        return this.pianos;
    }

    /**
     * 
     * @param input 
     * @param event 
     */
    private noteOn(input: Input, event: InputEventNoteon) {
        const code = event.note.octave*13 + this.pianoKeys.indexOf(event.note.name);

        if(!this.currentNotes.some(cNote => cNote.code === code)){
            this.currentNotes.push({
                code, 
                name:event.note.name, 
                octave: event.note.octave
            })
        }
    }

    /**
     * 
     * @param input 
     * @param event 
     */
    private noteOff(input: Input, event: InputEventNoteoff) {
        const code = event.note.octave*13 + this.pianoKeys.indexOf(event.note.name);

        const index = this.currentNotes.findIndex(cNote => cNote.code === code);
        if(index > -1){
            const removed = this.currentNotes.splice(index, 1);
        }
    }

    enable(): Promise<void> {
        return this.ready;
    }
}

export default new WebMidiService();