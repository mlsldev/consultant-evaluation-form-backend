const committee = require('../../domains/committee/Committee')

module.exports = class updateCommittee {
    constructor(committeeRepository) {
        this.committeeRepository = committeeRepository
    }

    async run(user, committeeId, data) {
        return this.committeeRepository.selectCommittee(new committee(committeeId))
            .then(_committee => {
                const nonAllowedChanges = Object.keys(data).filter(property => !_committee.checkUserPermissionToChangeFieldValue(property, user.email))

                if (!_committee.isCommitteeAdmin(user.email) && !_committee.isCommitteeOwner(user.email)) {
                    throw `Committee ${committeeId} does not relate to the user ${user.email}! Insufficient privileges`
                } else if (nonAllowedChanges.length > 0) {
                    throw `User ${user.email} cannot write the property ${nonAllowedChanges}! Insufficient privileges`
                } else {
                    Object.assign(_committee, data)
                    return this.committeeRepository.updateCommittee(_committee)
                }
            })
    }
}