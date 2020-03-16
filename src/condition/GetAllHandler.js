'use strict'

const connectToDatabase = require('../../db');
const Condition = require('../../models/Condition');

module.exports.getAll = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        connectToDatabase()
        let response = await findCondition()
        if (response.length == 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: ' No hay condiciones en la base de datos'
            }
        }
        else {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response)
            }
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: error.message
        }
    }
}

async function findCondition() {
    return new Promise(function (resolve, reject) {
        Condition.find({},
            function (error, docs) {
                if (error) {
                    reject({
                        statusCode: 500,
                        body: JSON.stringify(error),
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
                resolve(docs);
            }
        ).sort({ 'code': 1 });
    });
}