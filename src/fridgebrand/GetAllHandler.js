'use strict';

const connectToDatabase = require('../../db');
const FridgeBrand = require('../../models/FridgeBrand');

module.exports.getAll = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        connectToDatabase()
        let response = await findFridgebrand()
        if (response.length == 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: ' No hay tipos de equipo en la base de datos'
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

async function findFridgebrand() {
    return new Promise(function (resolve, reject) {
        FridgeBrand.find({},
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
        ).sort({ 'nombre': 1 });
    });
}

