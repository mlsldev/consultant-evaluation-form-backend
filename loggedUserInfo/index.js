const config = require('../config')
const tableClient = require('../infra/database/AzureTableClient')(config)

const userContextMiddleware = require('../userContextMiddleware')

module.exports = userContextMiddleware(tableClient, async function (context, req, user, tableClient) {
    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: user
    }
})