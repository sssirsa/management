'use strict';

const connectToDatabase = require('../../db');
const Condition = require('../../models/Condition');

module.exports.getOne = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var ConditionId = event.pathParrameters.id;
    try{
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha introducido ningún id para busqueda'
            }
        }
        connectToDatabase()
        let response = await findCondition(ConditionId)
        if (response.length == 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se encontro agencia con el id especificado'
            }
        }
        else {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response[0])
            }
        }
        
    }
    catch (error){
        return {
            statusCode: 500,
            headers: {'Content-Type':'application/json'},
            body: error.message
        }

    }
}

async function findCondition(ConditionId) {
    return new Promise(function (resolve, reject) {
        Condition.findById(ConditionId,
            function (error, docs) {
                if (error) {
                    reject({
                        statusCode: 500,
                        body: JSON.stringify(error),
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                resolve(docs);
            }
        );
    });
}