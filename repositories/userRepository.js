const user = require('../domains/users/User')
const enums = require('../enums')

module.exports = class userRepository {
    constructor(tableClient) {
        this.PartitionKey = enums.partitions.USER_PROFILE
        this.tableName = 'userProfile'
        this.tableClient = tableClient(this.tableName)

    }

    async selectUser(_user) {
        return this.tableClient.getEntity(this.PartitionKey, _user.email).then(result => {
            if(!result.roles || !result.userEmail) {
                throw `Bad data`
            }

            const roles = result.roles.includes(',') ? result.roles.split(',') : [result.roles]
            const User = new user(result.userEmail, roles)

            User.validate()

            return User

        }).catch(error => {
            if(error.statusCode === 404) {
                throw `User: ${userEmail} not found`
            } else {
                throw error.toString() 
            }
        })     
    }
}