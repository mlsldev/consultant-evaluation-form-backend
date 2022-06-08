const config = require('../config')
const tableClient = require('../infra/database/AzureTableClient')(config)

const userContextMiddleware = require('../userContextMiddleware')

const evaluationRepository = require('../repositories/evaluationRepository')
const committeeRepository = require('../repositories/committeeRepository')

const selectEvaluation = require('../useCases/evaluations/selectEvaluation')
const updateEvaluation = require('../useCases/evaluations/updateEvaluation')

module.exports = userContextMiddleware(tableClient, async function (context, req, user, tableClient) {
    /**
     * Select evaluation if the user is admin or owner
     */
    if (req.method === 'GET' && req.params.evaluationId) {
        const id = req.params.evaluationId
        const SelectEvaluation = new selectEvaluation(new evaluationRepository(tableClient), new committeeRepository(tableClient))

        await SelectEvaluation.run(user, id).then(result => {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: result
            }
        }).catch(error => {
            if (error === `Evaluation ${id} does not relate to the user ${user.email}! Insufficient privileges`) {
                context.res = {
                    status: 401,
                    body: error
                }
            }

            else if (error === `Evaluation: ${id} not found`) {
                context.res = {
                    status: 404,
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
    * Update evaluation if user is the owner
    */
    if (req.method === 'POST' && req.params.evaluationId && req.params.concept === undefined) {
        const id = req.params.evaluationId
        const data = { consultants } = req.body

        const UpdateEvaluation = new updateEvaluation(new evaluationRepository(tableClient))
        await UpdateEvaluation.run(user, id, data).then(result => {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: result
            }

        }).catch(error => {
            if (error === `Evaluation ${id} does not relate to the user ${user.email}! Insufficient privileges`) {
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

})