const { TableClient, AzureSASCredential } = require("@azure/data-tables") 

module.exports = (config) => {
    return (tableName) => {
        return new TableClient(config.host, tableName, new AzureSASCredential(config.sas))
    }
}