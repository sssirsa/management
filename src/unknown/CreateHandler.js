const connectToDatabase = require('../../db');
const Unknown = require('../../models/Unknown');

async function createUnknown(unknown) {
    return new Promise(((resolve, reject) => {
        Unknown.create(unknown,
            (error, docs) => {
                if (error) {
                    reject( new Error({
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
        if (!Shape.nombre || !Shape.descripcion) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'Required fields: nombre, descripcion',
            };
        }
        connectToDatabase()
        const response = await createUnknown(Shape);
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
