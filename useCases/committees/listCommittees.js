module.exports = class listCommittees {
    constructor(committeeRepository) {
        this.committeeRepository = committeeRepository
    }

    async run(user) {
        return this.committeeRepository.listCommittees().then(committees => {
            return committees
                .filter(committee => committee.rolesOfTheUser(user.email).length > 0)
                .map(committee => {
                    committee.myRoles = committee.rolesOfTheUser(user.email)
                    return committee
                })
                .map(committee => {
                    return filterFieldsByRole(user, committee)
                })
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