const evaluation = require('../../domains/evaluation/Evaluation')
module.exports = class updateEvaluation {
    constructor(evaluationRepository) {
        this.evaluationRepository = evaluationRepository
    }

    async run(user, evaluationId, data) {
        return this.evaluationRepository.selectEvaluation(new evaluation(evaluationId)).then(_evaluation => {
            if(_evaluation.owner === user.email) {
                Object.assign(_evaluation, data)
                return this.evaluationRepository.updateEvaluation(_evaluation)
    
            } else {
                throw `Evaluation ${evaluationId} does not relate to the user ${user.email}! Insufficient privileges`
            }
        })
        
    }
}