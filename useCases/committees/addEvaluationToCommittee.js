const evaluation = require('../../domains/evaluation/Evaluation')
const committee = require('../../domains/committee/Committee')

module.exports = class addEvaluationToCommittee {
    constructor(committeeRepository, evaluationRepository) {
        this.committeeRepository = committeeRepository
        this.evaluationRepository = evaluationRepository
    }

    async run(user, committeeId, data) {
        return this.committeeRepository.selectCommittee(new committee(committeeId)).then(_committee => {
            if(_committee.isCommitteeAdmin(user.email)) {
                const evaluations = _committee.evaluations

                return this.evaluationRepository.createEvaluation(new evaluation(null, committeeId, data.owner, null)).then(_evaluation => {
                    evaluations.push({ id: _evaluation.id, owner: _evaluation.owner})
                    _committee.evaluations = evaluations
                    return this.committeeRepository.updateCommittee(_committee)
                })

            } else {
                throw `Committee ${committeeId} does not relate to the user ${user.email}! Insufficient privileges`
            }

        })
    }
}