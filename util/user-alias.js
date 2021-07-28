const words =  require('categorized-words');

class UserAlias {
    constructor() {
        this.alias = "";
        for(let i = 0; i < 2; i++) {
            let temp = words.A[Math.floor(Math.random() * words.A.length)];
            this.alias += temp.charAt(0).toUpperCase()+temp.slice(1);
        }
        let noun = words.N[Math.floor(Math.random() * words.N.length)];
        this.alias += noun.charAt(0).toUpperCase() +noun.slice(1);
    }
}

module.exports = UserAlias;
