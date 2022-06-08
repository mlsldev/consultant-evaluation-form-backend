const committeeRepository = require('../repositories/committeeRepository')
const evaluationRepository = require('../repositories/evaluationRepository')
const addEvaluationToCommittee = require('../useCases/committees/addEvaluationToCommittee')
const removeEvaluationFromCommittee = require('../useCases/committees/removeEvaluationFromCommittee')

module.exports = async (context, req, user, tableClient) => {
    /**
     * Create committee's evaluation if the user has privilege
     */
    if (req.method === 'POST' && req.params.conceptId === undefined) {
        const id = req.params.committeeId
        const data = { owner } = req.body
        const AddEvaluationToCommittee = new addEvaluationToCommittee(new committeeRepository(tableClient), new evaluationRepository(tableClient))

        await AddEvaluationToCommittee.run(user, id, data).then(result => {
            context.res = {
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: result
            }

        }).catch(error => {
            if(error === `Committee ${id} does not relate to the user ${user.email}! Insufficient privileges`) {
                context.res = {
                    status: 401,
                    body: error
                }

            } 
            
            else if (error === `Invalid data`) {
                context.res = {
                    status: 400,
                    body: error
                }
            }
            
            else {
                context.log.error(error)

                context.res = {
                    status: 500,
                    body: 'Something went wrong!'
                }
            }    
        })
    }

    /**
     * Delete committee's evaluation if the user has privilege
     */
    if (req.method === 'DELETE' && req.params.conceptId) {
        const committeeId = req.params.committeeId
        const evaluationId = req.params.conceptId

        const RemoveEvaluationFromCommittee = new removeEvaluationFromCommittee(new committeeRepository(tableClient), new evaluationRepository(tableClient))
        
        await RemoveEvaluationFromCommittee.run(user, committeeId, evaluationId).then(result => {
            context.res = {
                status: 204
            }

        }).catch(error => {
            if(error === `Committee ${committeeId} does not relate to the user ${user.email}! Insufficient privileges`) {
                context.res = {
                    status: 401,
                    body: error
                }
                
            } else {
                context.log.error(error)

                context.res = {
                    status: 500,
                    body: 'Something went wrong!'
                }
            }    
        })
    }
}