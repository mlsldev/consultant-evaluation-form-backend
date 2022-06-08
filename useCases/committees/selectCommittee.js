const committee = require('../../domains/committee/Committee')
module.exports = class selectCommittee {
    constructor(committeeRepository) {
        this.committeeRepository = committeeRepository
    }

    async run(user, id) {
        return this.committeeRepository.selectCommittee(new committee(id)).then(_committee => {
            if(_committee.rolesOfTheUser(user.email).length > 0) {
                _committee.myRoles = _committee.rolesOfTheUser(user.email)
                return filterFieldsByRole(user, _committee)
                
            } else {
                throw `Committee ${id} does not relate to the user ${user.email}! Insufficient privileges`
            }
        })
    }
} 

const filterFieldsByRole = (user, committee) => {
    if(committee.isCommitteeAdmin(user.email)) {
        return committee
    }

    if(committee.rolesOfTheUser(user.email).length === 1 && committee.isCommitteeOwner(user.email)) {
        return { ...committee, 
            evaluations: [], 
            consultants: [], 
            parameters: [] 
        }
    }

    return { ...committee, evaluations: committee.evaluations.filter(evaluation => evaluation.owner === user.email) }
}