const validator = require('validator')
const enums = require('../../enums')

module.exports = class User {
    constructor(email, roles) {
        this.email = email
        this.roles = roles
    }

    validate() {
        let isValid = true

        if(!this.email) {
            isValid = false
        }

        if(!this.roles) {
            isValid = false
        }

        if(isValid && this.email) {
            isValid = validator.isEmail(this.email)
        }

        if(isValid && this.roles) {
            isValid = this.roles.length > 0
        }

        if(!isValid) throw 'Invalid data'
        
    }

    isCommitteeCreator() {
        return this.roles.includes(enums.UserRoles.COMMITTEE_CREATOR)
    }

    isCommitteeAdmin() {
        return this.roles.includes(enums.UserRoles.COMMITTEE_ADMIN)
    }
}