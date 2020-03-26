const connectToDatabase = require('../../db');
const Agency = require('../../models/Agency');

async function createAgency(agency) {
    return new Promise(((resolve, reject) => {
        Agency.create(agency,
            (error, docs) => {
                if (error) {
                    reject(new Error({
                        statusCode: 500,
                        body: JSON.stringify(error),
                        headers: { 'Content-Type': 'application/json' },
                    }))
                }
                resolve(docs);
            }
        );
    }));
}

module.exports.create = async (event, context) => {
    const mongoconection = context;
    mongoconection.callbackWaitsForEmptyEventLoop = false;
    const Shape = JSON.parse(event.body);
    try {
        if (!Shape.agencia || !Shape.direccion) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'Required fields: agencia, direccion',
            };
        }
        connectToDatabase()
        const response = await createAgency(Shape);
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: error.message,
        }
    }
}
