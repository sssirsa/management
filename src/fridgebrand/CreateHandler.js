'use strict';

const connectToDatabase = require('../../db');
const FridgeBrand = require('../../models/FridgeBrand');

module.exports.create = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var Shape = JSON.parse(event.body);

    try{
        if(!Shape.nombre)
        return{
            statusCode: 400,
            headers: {'Content-Type':'application/json'},
            body: 'Required field nombre'
        };
        connectToDatabase()
        let response = await createFridgebrand(Shape);
        return {
            statusCode: 201,
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(response)
        }
    }
    catch (error){
        return {
            statusCode: 500,
            headers: {'Content-Type':'application/json' },
            body: error.message
        }
    }
}

async function createFridgebrand(Unilever_Fridgebrand) {
    return new Promise(function (resolve, reject) {
        FridgeBrand.create(Unilever_Fridgebrand,
            function (error, docs) {
                if (error) {
                    PromiseRejectionEvent({
                        statusCode: 500,
                        body: JSON.stringify(error),
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
                resolve(docs);
            }
        );
    });
}