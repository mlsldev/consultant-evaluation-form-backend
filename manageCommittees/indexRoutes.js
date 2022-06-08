const enums = require('../enums')

const committeeRoutes = require('./committeeRoutes')
const consultantRoutes = require('./consultantRoutes')
const evaluationsRoutes = require('./evaluationRoutes')

module.exports = async (context, req, user, tableClient) => {
    if (req.params.concept === undefined) {
        await committeeRoutes(context, req, user, tableClient)     
    } else if (req.params.committeeId && req.params.concept === enums.CommitteeWebServiceConcepts.CONSULTANTS) {
        await consultantRoutes(context, req, user, tableClient)
    } else if (req.params.committeeId && req.params.concept === enums.CommitteeWebServiceConcepts.EVALUATIONS) {
        await evaluationsRoutes(context, req, user, tableClient)
    }
}