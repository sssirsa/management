const connectToDatabase = require('../../db');
const Unknown = require('../../models/Unknown');

async function findUnknown(Unknownid) {
    return new Promise(((resolve, reject) => {
        Unknown.findById(Unknownid,
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
    const UnknownId = event.pathParameters.id;
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha introducido ningún id para busqueda'
            }
        }
        connectToDatabase()
        const response = await findUnknown(UnknownId)
        if (response.length === 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se encontro impedimento con el id especificado'
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
