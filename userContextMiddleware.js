const userRepository = require('./repositories/userRepository')
const retrieveUserInfo = require('./useCases/users/retrieveUserInfo')
const user = require('./domains/users/User')

module.exports = (tableClient, func) => {
    return async function (context, req) {
        const userEmail = req.query.userEmail

        if (!userEmail) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: { errorMessage: 'This call is not authenticated' }
            }
        }

        try {
            const RetrieveUserInfo = new retrieveUserInfo(new userRepository(tableClient))
            await RetrieveUserInfo.run(userEmail).then(user => {
                return func(context, req, user, tableClient)
            }).catch(error => {
                if (error.toString().startsWith(`ReferenceError: userEmail is not defined`)) {
                    return func(context, req, new user(userEmail, []), tableClient)
                } else {
                    throw error
                }
            })
        } catch (error) {
            context.log.error(error)
            
            context.res = {
                status: 500,
                body: 'Something went wrong!'
            }
        }

    }
}

