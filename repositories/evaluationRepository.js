const { v4: uuid } = require('uuid');
const evaluation = require('../domains/evaluation/Evaluation')
const enums = require('../enums')

module.exports = class evaluationRepository {
    constructor(tableClient) { 
        this.PartitionKey = enums.partitions.EVALUATIONS
        this.tableName = 'evaluations'
        this.tableClient = tableClient(this.tableName)

    }

    async createEvaluation(_evaluation) {
        _evaluation.validate()

        const entry = {
            partitionKey: this.PartitionKey,
            rowKey: uuid(),
            committeeId: _evaluation.committeeId,
            owner: _evaluation.owner
        }
        
        return this.tableClient.createEntity(entry).then(result => {
            return new evaluation(entry.rowKey, entry.committeeId, entry.owner, [])    
        })

    }

    async updateEvaluation(_evaluation) {
        _evaluation.validate()
        
        return new Promise(async (resolve, reject) => {
            if(_evaluation.consultants) {
                _evaluation.consultants = JSON.stringify(_evaluation.consultants)
            }

            const data = { consultants } = _evaluation

            const entry = {
                partitionKey: this.PartitionKey,
                rowKey: _evaluation.id,
                ...data
            }
            
            await Promise.all([this.tableClient.updateEntity(entry), this.selectEvaluation(new evaluation(_evaluation.id))])
                .then(values => {
                    resolve(values[1])

                }).catch(reject)
        
        })
         
    }


    async deleteEvaluation(evaluation) {
        return this.tableClient.deleteEntity(this.PartitionKey, evaluation.id)
    }

    async selectEvaluation(_evaluation) {

        return this.tableClient.getEntity(this.PartitionKey, _evaluation.id)
            .then(result => {
                const consultants = result.consultants ? JSON.parse(result.consultants) : []
                return new evaluation(result.rowKey, result.committeeId, result.owner, consultants)   
            }).catch(error => {
                if(error.statusCode === 404) {
                    throw `Evaluation: ${_evaluation.id} not found`

                } else {
                    throw error.toString() 
                }
            })   
    } 
}

