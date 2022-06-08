const committee = require('../../domains/committee/Committee')
const evaluation = require('../../domains/evaluation/Evaluation')
module.exports = class removeEvaluationFromCommittee {
    constructor(committeeRepository, evaluationRepository) {
        this.committeeRepository = committeeRepository
        this.evaluationRepository = evaluationRepository
    }

    async run(user, committeeId, evaluationId) {
        return this.committeeRepository.selectCommittee(new committee(committeeId)).then(_committee => {
            if(_committee.isCommitteeAdmin(user.email)) {
                return this.evaluationRepository.deleteEvaluation(new evaluation(evaluationId))
                    .then(result => {
                        const evaluations = _committee.evaluations.filter(evaluation => evaluation.id !== evaluationId)

                        _committee.evaluations = evaluations
                        return this.committeeRepository.updateCommittee(_committee)
                    })
                
            } else {
                throw `Committee ${committeeId} does not relate to the user ${user.email}! Insufficient privileges`
            }
        })
    }
}