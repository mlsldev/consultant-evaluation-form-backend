const committeeRepository = require('../repositories/committeeRepository')

const createCommittee = require('../useCases/committees/createCommittee')
const selectCommittee = require('../useCases/committees/selectCommittee')
const listCommittees = require('../useCases/committees/listCommittees')
const updateCommittee = require('../useCases/committees/updateCommittee')

module.exports = async (context, req, user, tableClient) => {
    /**
     * List all committees related to the user
     */
    if (req.method === 'GET' && req.params.committeeId === undefined) {
        const ListCommittees = new listCommittees(new committeeRepository(tableClient))

        await ListCommittees.run(user).then(result => {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: result
            }
        }).catch(error => {
            context.log.error(error)
            context.res = {
                status: 500,
                body: 'Something went wrong!'
            }
        })
    }


    /**
     * Select committee if related to the user
     */
    if (req.method === 'GET' && req.params.committeeId) {
        const id = req.params.committeeId
        const SelectCommittee = new selectCommittee(new committeeRepository(tableClient))

        await SelectCommittee.run(user, id).then(result => {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: result
            }
        }).catch(error => {
            if (error === `Committee ${id} does not relate to the user ${user.email}! Insufficient privileges`) {
                context.res = {
                    status: 401,
                    body: error.Error
                }
            }

            else if (error === `Committee: ${id} not found`) {
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
    * Create committee if user has privilege
    */
    if (req.method === 'POST' && req.params.committeeId === undefined) {
        const data = { description, admin, evaluations, consultants, parameters } = req.body
        const CreateCommittee = new createCommittee(new committeeRepository(tableClient))

        await CreateCommittee.run(user, data).then(result => {
            context.res = {
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: result
            }

        }).catch(error => {
            if (error === 'Insufficient privileges') {
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
    * Update committee if user has privilege
    */
    if (req.method === 'POST' && req.params.committeeId && req.params.concept === undefined) {
        const id = req.params.committeeId
        const data = { description, admin, evaluations, consultants, parameters, status } = req.body

        const UpdateCommittee = new updateCommittee(new committeeRepository(tableClient))

        await UpdateCommittee.run(user, id, data).then(result => {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: result
            }

        }).catch(error => {
            if (error === `Committee ${id} does not relate to the user ${user.email}! Insufficient privileges`) {
                context.res = {
                    status: 401,
                    body: error
                }
            }

            else if (error.startsWith(`User ${user.email} cannot write the property`)) {
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
}