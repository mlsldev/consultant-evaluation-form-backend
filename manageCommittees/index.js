const config = require('../config')
const tableClient = require('../infra/database/AzureTableClient')(config)

const userContextMiddleware = require('../userContextMiddleware')
const indexRoutes = require('./indexRoutes')


module.exports = userContextMiddleware(tableClient, async function (context, req, user, tableClient) {
    await indexRoutes(context, req, user, tableClient)
})
