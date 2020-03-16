'use strict';

const connectToDatabase = require('../../db');
const Sssirsa = require('../../models/Sssirsa');
const validator = require('validator');

module.exports.getOne = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var StatusId = event.pathParameters.id;
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha indroducido ningún id para busqueda'
            }
        }
        else if (!validator.isNumeric(event.pathParameters.id)) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: "El id introducido no es un valor numerico valido"
            };
        }
        connectToDatabase()
        let response = await findStatus(StatusId)
        if (response.length == 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se encontro estatus sssirsa con el id especificado'
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
    catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: error.message
        }
    }
}

async function findStatus(StatusId){
    return new Promise(function (resolve, reject){
        Sssirsa.find({ "code": StatusId },
            function(error, docs){
                if (error){
                    reject({
                        statusCode: 500,
                        body: JSON.stringify(error),
                        headers: { 'Content-Type':'application/json'}
                    });
                }
                resolve(docs);
            }
        );
    });
}