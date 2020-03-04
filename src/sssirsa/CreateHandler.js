'use strict';

const connectToDatabase = require('../../db');
const Sssirsa = require('../../models/Sssirsa');

module.exports.create = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var Status = JSON.parse(event.body);

    try {
        if (!Status.description || !Status.code) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: "Required fields: code, description"
            };
        }
        connectToDatabase()
        let response = await createStatus(Status);
        return {
            statusCode: 201,
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

async function createStatus(StatusSssirsa) {
    return new Promise(function (resolve, reject) {
        Sssirsa.create(StatusSssirsa,
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