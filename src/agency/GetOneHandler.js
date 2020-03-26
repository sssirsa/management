const connectToDatabase = require('../../db');
const Agency = require('../../models/Agency');

async function findAgency(Agencyid) {
    return new Promise(((resolve, reject) => {
        Agency.findById(Agencyid,
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
    const AgencyId = event.pathParameters.id;
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha introducido ningún id para busqueda'
            }
        }
        connectToDatabase()
        const response = await findAgency(AgencyId)
        if (response.length === 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se encontro agencia con el id especificado'
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
