const validator = require('validator')
module.exports = class Evaluation {
    constructor(id, committeeId, owner, consultants) {
        this.id = id
        this.committeeId = committeeId
        this.owner = owner
        this.consultants = consultants
    }

    validate() {
        let isValid = true

        if(isValid && this.id) {
            isValid = validator.isUUID(this.id, 4)
        }

        if(isValid && this.committeeId) {
            isValid = validator.isUUID(this.committeeId, 4)
        }

        if(isValid && this.owner) {
            isValid = validator.isEmail(this.owner)
        }

        if(isValid && this.consultants) {
            isValid = this.consultants.filter(consultant => {
                return !validator.isUUID(consultant.id, 4) || !Array.isArray(consultant.scores) 
            }).length === 0
        }

        if(!isValid) throw 'Invalid data'
        
    }
}