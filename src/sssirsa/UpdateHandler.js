'use strict';

const connectToDatabase = require('../../db');
const Sssirsa = require('../../models/Sssirsa');

module.exports.update = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var Status = JSON.parse(event.body);
    var StatusId = event.pathParameters.id;

    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha indroducido ningún id para busqueda'
            };
        }
        connectToDatabase()
        let response = await updateStatus(StatusId, Status);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
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

async function updateStatus(StatusId, StatusSssirsa) {
    return new Promise(function (resolve, reject) {
        Sssirsa.findByIdAndUpdate(StatusId, StatusSssirsa,
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