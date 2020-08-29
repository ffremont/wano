import Vex, { IRenderContext } from 'vexflow';

export enum Keys{
    SOL ='treble',
    FA = 'bass'
}

export interface Note{
    letter:string;
    acc?:string;
    octave:string;
}


export interface VisibleNotes{
    key:Keys,
    items:{note:Note, node:any}[]
}

export class AppVexFlow{

    duration = 10;
    width:number;
    static LIMIT_LEFT = 20;

    context : IRenderContext;
    tickContext: Vex.Flow.TickContext;
    solStave: Vex.Flow.Stave;
    faStave: Vex.Flow.Stave;

    visibleNotesGroups:VisibleNotes[] = [];

    classes = {
        scrolling: () => `transform: translate(-${this.width - AppVexFlow.LIMIT_LEFT}px, 0);`,
        scroll: (duration:number) => `animation: mtanimation ${duration}s linear, opacity 0.5s ease-out, fill 0.2s linear;`,
        tooSlow: () => `transform: translateY(5px);`
    }

    constructor(o:any){
        this.context = o.context;
        this.tickContext = o.tickContext;
        this.solStave = o.solStave;
        this.faStave = o.faStave;
        this.width = o.width || 400;
    }

    static from(selectorContainer:string, width:number, height:number) : AppVexFlow{
        console.log({width,height})
        const VF = Vex.Flow;

        const div :any = document.querySelector(selectorContainer);
        
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        renderer.resize(width, height);
        const context = renderer.getContext();

        const tickContext = new VF.TickContext();

        const solStave = new VF.Stave(10, 10, 10000)
            .addClef('treble');
        solStave.setContext(context).draw();

        const faStave = new VF.Stave(10, 100, 10000)
            .addClef('bass');
        faStave.setContext(context).draw();

        tickContext.preFormat().setX(width);

        return new AppVexFlow({
            context, tickContext,solStave, faStave, width
        });
    }

    /**
     * Affiche une note
     * 
     * @param note 
     * @param key 
     */
    public show(note:Note, key: Keys = Keys.SOL){
        const staveNote = this.newNote(note, key);
        this.displayStaveNote(staveNote, note,key);
    }

    /**
     * Retire une ou pliseurs notes
     * 
     * @param note 
     * @param key 
     */
    withdraw(notes:Note[], key:Keys = Keys.SOL){
        if(this.visibleNotesGroups.length <= 0) return;

        const visibleNotes = this.visibleNotesGroups[0];
        if(visibleNotes.key !== key) return;

        
        // toutes les notes visibles doivent être présentes dans la variable "notes"
        if(
            visibleNotes.items.every(vNote => 
                notes.some(note => 
                    vNote.note.letter === note.letter 
                    && vNote.note.octave === note.octave
                    && vNote.note.acc === note.acc
                )
            )
        ){
            // si la note à retirer est bien la dernière
            visibleNotes.items.forEach(vNote => {
                vNote.node.setAttribute('style', this.classes.tooSlow());
            })
            this.visibleNotesGroups.shift();            
        }
    }

    /**
     * C
     * @param note 
     * @param key 
     */
    private newNote(note:Note, key: Keys = Keys.SOL):Vex.Flow.StaveNote{
        const staveNote:any = new Vex.Flow.StaveNote({
            clef: key,
            keys: [`${note.letter}${note.acc}/${note.octave}`],
            duration:'1',
        })
        .setContext(this.context)
        .setStave(key === Keys.SOL ? this.solStave : this.faStave );

        if (note.acc) staveNote.addAccidental(0, new Vex.Flow.Accidental(note.acc));
        this.tickContext.addTickable(staveNote);

        return staveNote;
    }

    /**
     * 
     * @param staveNote 
     */
    private displayStaveNote(staveNote: Vex.Flow.StaveNote, note:Note, key:Keys){
        const group:any = this.context.openGroup();
        this.visibleNotesGroups.push({
            key, items:[{note, node:group}]
        });
        staveNote.draw();
        this.context.closeGroup();
        
        group.classList.add('scroll');
        group.classList.add('scrolling')
        group.setAttribute('style', `${this.classes.scrolling()};${this.classes.scroll(this.duration)}`)
    }
}
