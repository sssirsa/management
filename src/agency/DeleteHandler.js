const connectToDatabase = require('../../db');
const Agency = require('../../models/Agency');

module.exports.create = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var AgencyId = event.pathParameters.id;
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'No se ha introducido ningún id para eliminar el elemento'
            }
        }
        connectToDatabase()
        let response = await deleteAgency(AgencyId)

    }
    catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: error.message
        }
    }
}