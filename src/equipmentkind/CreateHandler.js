const connectToDatabase = require('../../db');
const EquipmentKind = require('../../models/EquipmentKind');

async function createEquipmentKind(equipmentkind){
    return new Promise(((resolve, reject) => {
        EquipmentKind.create(equipmentkind,
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
        if(!Shape.nombre){
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: "Required fields: nombre"
            };
        }
        connectToDatabase()
        const response = await createEquipmentKind(Shape);
        return {
            statusCode: 201,
            headers: {'Content-Type':'application/json'},
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