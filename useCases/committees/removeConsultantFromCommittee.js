const committee = require('../../domains/committee/Committee')
module.exports = class removeConsultantFromCommittee {
    constructor(committeeRepository) {
        this.committeeRepository = committeeRepository
    }

    async run(user, committeeId, consultantId) {
        return this.committeeRepository.selectCommittee(new committee(committeeId)).then(_committee => {
            if(_committee.isCommitteeAdmin(user.email)) {
                const consultants = _committee.consultants.filter(consultant => consultant.id !== consultantId)
                _committee.consultants = consultants
                
                return this.committeeRepository.updateCommittee(_committee)
                
            } else {
                throw `Committee ${committeeId} does not relate to the user ${user.email}! Insufficient privileges`
            }
        })
    }
}