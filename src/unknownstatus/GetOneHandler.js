const connectToDatabase = require('../../db');
const UnknownStatus = require('../../models/UnknownStatus');

async function findUnknownStatus(UnknownStatusid) {
    return new Promise(((resolve, reject) => {
        UnknownStatus.findById(UnknownStatusid,
            (error, docs) => {
                if (error) {
                    reject(new Error({
                        statusCode: 500,
                        body: JSON.stringify(error),
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
                resolve(docs);
            }
        );
    }));
}

module.exports.getOne = async (event, context) => {
    const mongoconection = context;
    mongoconection.callbackWaitsForEmptyEventLoop = false;
    const UnknownStatusId = event.pathParameters.id;
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha introducido ningún id para busqueda'
            }
        }
        connectToDatabase()
        const response = await findUnknownStatus(UnknownStatusId)
        if (response.length === 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se encontro restriccion con el id especificado'
            }
        }
        
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
