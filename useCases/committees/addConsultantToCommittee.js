const { v4: uuid } = require('uuid');
const committee = require('../../domains/committee/Committee')
module.exports = class addConsultantToCommittee {
    constructor(committeeRepository) {
        this.committeeRepository = committeeRepository
    }

    async run(user, committeeId, data) {
        return this.committeeRepository.selectCommittee(new committee(committeeId)).then(_committee => {
            if(_committee.isCommitteeAdmin(user.email)) {
                const consultants = _committee.consultants
                consultants.push({ id: uuid(), description: data.description })
                _committee.consultants = consultants

                return this.committeeRepository.updateCommittee(_committee)
            } else {
                throw `Committee ${committeeId} does not relate to the user ${user.email}! Insufficient privileges`
            }
        })
    }
}