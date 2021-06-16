const words = require('categorized-words');

class WorkingTitle {
    constructor(numAdj){    
       this.title = "";
        for(let i = 0; i < numAdj; i++) {
            let temp = words.A[Math.floor(Math.random() * words.A.length)];
            this.title += temp.charAt(0).toUpperCase() + temp.slice(1) + "-";
        }
        let noun = words.N[Math.floor(Math.random() * words.N.length)];
        this.title += noun.charAt(0).toUpperCase() + noun.slice(1);
    }
}

module.exports = WorkingTitle;
