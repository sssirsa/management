'use strict';

const connectToDatabase = require('../../db');
const Condition = require('../../models/Condition');

module.exports.create = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var Shape = JSON.parse(event.body);

    try {
        if (!Shape.letra) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'Required field letra'
            };
        }
        connectToDatabase()
        let response = await createCondition(Shape);
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            bosy: JSON.stringify(response)
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

async function createCondition(Unilever_Condition) {
    return new Promise(function (resolve, reject) {
        Condition.create(Unilever_Condition,
            function (error, docs) {
                if (error) {
                    PromiseRejectionEvent({
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