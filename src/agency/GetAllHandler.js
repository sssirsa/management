'use strict';

const connectToDatabase = require('../../db');
const Agency = require('../../models/Agency');

module.exports.getAll = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        connectToDatabase()
        let response = await findAgency()
        if (response.length == 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: 'No hay agencias en la base de datos'
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

async function findAgency() {
    return new Promise(function (resolve, reject) {
        Agency.find({},
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
        ).sort({ 'agencia': 1 });
    });
}