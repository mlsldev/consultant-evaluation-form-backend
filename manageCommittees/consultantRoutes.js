const committeeRepository = require('../repositories/committeeRepository')
const addConsultantToCommittee = require('../useCases/committees/addConsultantToCommittee')
const removeConsultantFromCommittee = require('../useCases/committees/removeConsultantFromCommittee')

module.exports = async (context, req, user, tableClient) => {
    if (req.method === 'POST' && req.params.conceptId === undefined) {
        const id = req.params.committeeId
        const data = { description } = req.body
        const AddConsultantToCommittee = new addConsultantToCommittee(new committeeRepository(tableClient))

        await AddConsultantToCommittee.run(user, id, data).then(result => {
            context.res = {
                status: 200,
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

            } else if (error === `Invalid data`) {
                context.res = {
                    status: 400,
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



    /**
     * Delete committee's consultant if the user has privilege
     */
    if (req.method === 'DELETE' && req.params.conceptId) {
        const committeeId = req.params.committeeId
        const consultantId = req.params.conceptId

        const RemoveConsultantFromCommittee = new removeConsultantFromCommittee(new committeeRepository(tableClient))
        await RemoveConsultantFromCommittee.run(user, committeeId, consultantId).then(result => {
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