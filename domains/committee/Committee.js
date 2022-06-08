const validator = require('validator')
const enums = require('../../enums')

module.exports = class Committee {
    constructor(id, description, owner, admin, evaluations, createdAt, status, consultants, parameters) {
        this.id = id
        this.description = description
        this.owner= owner
        this.admin = admin
        this.evaluations = evaluations
        this.createdAt = createdAt
        this.status = status
        this.consultants = consultants
        this.parameters = parameters
    }

    validate() {
        let isValid = true

        if(!this.description || !this.owner || !this.admin) {
            isValid = false
        }

        if(isValid && this.id) {
            isValid = validator.isUUID(this.id, 4)
        }

        if(isValid && this.description) {
            isValid = validator.isAlphanumeric(this.description, 'en-US', { ignore: " " })
        }

        if(isValid && this.owner) {
            isValid = validator.isEmail(this.owner)
        }

        if(isValid && this.admin) {
            isValid = validator.isEmail(this.admin)
        }

        if(isValid && this.status) {
            isValid = validator.isAlpha(this.status, 'en-US')
        }

        if(isValid && this.consultants) {
            isValid = this.consultants.filter(consultant => {
                return !validator.isAlphanumeric(consultant.description, 'en-US', { ignore: " " })
            }).length === 0
        }

        if(!isValid) throw 'Invalid data'
        
    }

    checkUserPermissionToChangeFieldValue(property, email) {
        if(property === 'description') return this.isCommitteeAdmin(email) || this.isCommitteeOwner(email)
        if(property === 'admin') return this.isCommitteeAdmin(email) || this.isCommitteeOwner(email)
        if(property === 'evaluations') return this.isCommitteeAdmin(email)
        if(property === 'status') return this.isCommitteeAdmin(email)
        if(property === 'consultants') return this.isCommitteeAdmin(email)
        if(property === 'parameters') return this.isCommitteeAdmin(email)
    }

    rolesOfTheUser(email) {
        const roles = []

        if(this.owner === email) {
            roles.push(enums.UserRoles.COMMITTEE_CREATOR)
        }
        
        if (this.admin === email) {
            roles.push(enums.UserRoles.COMMITTEE_ADMIN)
        }  
        
        if (this.evaluations.filter(evaluation => evaluation.owner === email).length > 0) {
            roles.push(enums.UserRoles.COMMITTEE_PARTICIPANT)
        } 

        return roles
    }

    isCommitteeAdmin(email) {
        return this.admin === email
    }

    isCommitteeOwner(email) {
        return this.owner === email
    }
}