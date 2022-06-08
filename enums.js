UserRoles = {
    COMMITTEE_CREATOR: '0',
    COMMITTEE_ADMIN: '1',
    COMMITTEE_PARTICIPANT: '2'
}

partitions = {
    USER_PROFILE: 'user_profile',
    COMMITTEES: 'committees',
    EVALUATIONS: 'evaluations'
}

CommitteeStatus = {
    DRAFT: 'draft',
    OPEN: 'open',
    CLOSE: 'close'
}

CommitteeWebServiceConcepts = {
    EVALUATIONS: 'evaluations',
    CONSULTANTS: 'consultants'
}

module.exports = {
    partitions,
    UserRoles,
    CommitteeStatus,
    CommitteeWebServiceConcepts
}
