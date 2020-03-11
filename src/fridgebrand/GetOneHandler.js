'use strict';

const connectToDatabase = require('../../db');
const FridgeBrand = require('../../models/FridgeBrand');

module.exports.getOne = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var FridgeBrandId = event.pathParrameters.id;
    try{
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha introducido ningún id para busqueda'
            }
        }
        connectToDatabase()
        let response = await findFridgeBrand(FridgeBrandId)
        if (response.length == 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se encontro marca con el id especificado'
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
    catch (error){
        return {
            statusCode: 500,
            headers: {'Content-Type':'application/json'},
            body: error.message
        }

    }
}

async function findFridgeBrand(FridgeBrandId) {
    return new Promise(function (resolve, reject) {
        FridgeBrand.findById(FridgeBrandId,
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