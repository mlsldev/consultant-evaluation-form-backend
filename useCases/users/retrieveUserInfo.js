const user = require('../../domains/users/User')
module.exports = class retrieveUserInfo {
    constructor(userRepository) {
        this.userRepository = userRepository   
    }

    async run(email) {
        new user(email, null)
        return this.userRepository.selectUser(new user(email, null))
    }
} 