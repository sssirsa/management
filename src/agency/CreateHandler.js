'use strict';

const connectToDatabase = require('../../db');
const Agency = require('../../models/Agency');

module.exports.create = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var Shape = JSON.parse(event.body);

    try {
        if (!Shape.agencia || !Shape.direccion) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: "Required fields: agencia, direccion"
            };
        }
        connectToDatabase()
        let response = await createAgency(Shape);
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

async function createAgency(Unilever_Agency) {
    return new Promise(function (resolve, reject) {
        Agency.create(Unilever_Agency,
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
        );
    });
}