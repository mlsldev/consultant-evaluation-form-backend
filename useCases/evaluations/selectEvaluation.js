const evaluation = require('../../domains/evaluation/Evaluation')
const committee = require('../../domains/committee/Committee')
module.exports = class selectEvaluation {
    constructor(evaluationRepository, committeeRepository) {
        this.evaluationRepository = evaluationRepository
        this.committeeRepository = committeeRepository
    }

    async run(user, id) {
        return this.evaluationRepository.selectEvaluation(new evaluation(id))
            .then(_evaluation => {
                return this.committeeRepository.selectCommittee(new committee(_evaluation.committeeId)).then(_committee => {
                    if(_evaluation.owner === user.email || _committee.isCommitteeAdmin(user.email)) {
                        const consultants = this._getConsultantInfo(_committee, _evaluation.consultants)
                        _evaluation.consultants = consultants
                        _evaluation.parameters = _committee.parameters
    
                        return _evaluation
                
                    } else {
                        throw `Evaluation ${id} does not relate to the user ${user.email}! Insufficient privileges`
                    }
            })
        })
    }

    _getConsultantInfo(committee, consultants) {
        const _consultants = [...consultants]

        if(committee.consultants && committee.consultants.length > 0) {
            for(const committeeConsultant of committee.consultants) {
                if(consultants.filter(consultant => consultant.id === committeeConsultant.id).length === 0) {
                    _consultants.push(committeeConsultant)
                } 
            }

            return _consultants
        } else {
            return consultants
        }
    }
} 