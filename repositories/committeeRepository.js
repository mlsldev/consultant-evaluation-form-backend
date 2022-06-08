const { odata } = require("@azure/data-tables") 

const { v4: uuid } = require('uuid');
const committee = require('../domains/committee/Committee')
const enums = require('../enums')

module.exports = class committeeRepository {
    constructor(tableClient) { 
        this.PartitionKey = enums.partitions.COMMITTEES
        this.tableName = 'committees'
        this.tableClient = tableClient(this.tableName)

    }

    async createCommittee(_committee) {
        _committee.validate()

        _committee.evaluations ? _committee.evaluations = JSON.stringify(_committee.evaluations) : _committee.evaluations = "[]"
        _committee.consultants ? _committee.consultants = JSON.stringify(_committee.consultants) : _committee.consultants = "[]"
        _committee.parameters ? _committee.parameters = JSON.stringify(_committee.parameters) : _committee.parameters = "[]"

        const entry = {
            partitionKey: this.PartitionKey,
            rowKey: uuid(),
            description: _committee.description,
            owner: _committee.owner, 
            admin: _committee.admin,
            evaluations: _committee.evaluations,
            status: enums.CommitteeStatus.DRAFT,
            consultants: _committee.consultants,
            parameters: _committee.parameters
        }

        return this.tableClient.createEntity(entry).then(result => {
            const id = result.location.split("RowKey=\'")[1].split("')")[0]
            return this.selectCommittee(new committee(id))
        })

    }

    async updateCommittee(_committee) {
        _committee.validate()
        
        if(_committee.evaluations) { _committee.evaluations = JSON.stringify(_committee.evaluations) }
        if(_committee.consultants) { _committee.consultants = JSON.stringify(_committee.consultants) }
        if(_committee.parameters) { _committee.parameters = JSON.stringify(_committee.parameters) }

        const data = { ..._committee }
        delete data.id
        delete data.owner
        delete data.createdAt

        const entry = {
            partitionKey: this.PartitionKey,
            rowKey: _committee.id,
            ...data
        }

        return this.tableClient.updateEntity(entry).then(result => {
            return this.selectCommittee(new committee(_committee.id))
        })         
    }

    async selectCommittee(_committee) {
        return this.tableClient.getEntity(this.PartitionKey, _committee.id).then(result => {
            const evaluations = result.evaluations ? JSON.parse(result.evaluations) : []
            const consultants = result.consultants ? JSON.parse(result.consultants) : []
            const parameters = result.parameters ? JSON.parse(result.parameters) : []

            return new committee(result.rowKey, result.description, result.owner, result.admin, evaluations, result.timestamp, result.status, consultants, parameters)
        
        }).catch(error => {
            if(error.statusCode === 404) {
                throw `Committee: ${_committee.id} not found`
            } else {
                throw error.toString()
            }
        })
    } 

    async listCommittees() {
        const committees = []
        
        const entities = this.tableClient.listEntities({
            queryOptions: { filter: odata`PartitionKey eq ${this.PartitionKey}` }
        })

        for await (const entity of entities) {
            const evaluations = entity.evaluations ? JSON.parse(entity.evaluations) : []
            const consultants = entity.consultants ? JSON.parse(entity.consultants) : []
            const parameters = entity.parameters ? JSON.parse(entity.parameters) : []

            committees.push(new committee(entity.rowKey, entity.description, entity.owner, entity.admin, evaluations, entity.timestamp, entity.status, consultants, parameters))
        }

        return committees
    } 
}