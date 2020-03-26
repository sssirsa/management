const connectToDatabase = require('../../db');
const RestictionReason = require('../../models/RestrictionReason');

async function createRestrictionReason(restrictionreason) {
    return new Promise(((resolve, reject) => {
        RestictionReason.create(restrictionreason,
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
        if(!Shape.description){
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: 'Required fields: description',
            };            
        }
        connectToDatabase()
        const response = await createRestrictionReason(Shape);
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
