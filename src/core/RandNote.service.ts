class RandNoteService{

    public between(min:number,max:number){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    /**
     * 
     * @param values 
     */
    public alea(values : any[]){
        const randIndex = this.between(0, values.length - 1);
        
        return values[randIndex];
    }

    /**
     * 
     * @param minKey 
     * @param maxKey 
     * @param factorDispersion 
     */
    public noteBetween(minInterval:number[], maxInterval:number[], factorDispersion:number):number{
        // min = 52 et max 44 => 20
        const dispersionMin = Math.ceil(Math.abs(minInterval[0] - maxInterval[0]) * factorDispersion);
        const dispersionMax = Math.ceil(Math.abs(minInterval[1] - maxInterval[1]) * factorDispersion);

        const newMinKey = minInterval[0] - dispersionMin, newMaxKey = minInterval[1] + dispersionMax;

        return this.between(newMinKey, newMaxKey);
    }

}

export default new RandNoteService();