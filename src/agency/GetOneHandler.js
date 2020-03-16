'use strict';

const connectToDatabase = require('../../db');
const Agency = require('../../models/Agency');

module.exports.getOne = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var AgencyId = event.pathParameters.id;
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha introducido ningún id para busqueda'
            }
        }
        connectToDatabase()
        let response = await findAgency(AgencyId)
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

async function findAgency(AgencyId) {
    return new Promise(function (resolve, reject) {
        Agency.findById(AgencyId,
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