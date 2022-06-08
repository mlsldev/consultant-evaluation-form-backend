const committee = require('../../domains/committee/Committee')
module.exports = class createCommittee {
    constructor(committeeRepository) {
        this.committeeRepository = committeeRepository
    }

    async run(user, data) {
        if(!user.isCommitteeCreator()) {
            throw 'Insufficient privileges'
        } else {
            data.owner = user.email
            data.admin = data.admin ? data.admin : user.email
            
            return this.committeeRepository.createCommittee(new committee(null, data.description, data.owner, data.admin, data.evaluations, null, null, data.consultants, data.parameters))
        }
    }
}