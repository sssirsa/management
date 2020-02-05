'use strict';

const connectToDatabase = require('../../db');
const Fridge = require('./fridge');
const mongoose = require('mongoose');

//#region Create
module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;             // Call the Create Function
    return connectToDatabase()
        .then(() =>
            create(JSON.parse(event.body))
        )
        .then(session => ({                                    // Return when the creation it's OK
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session)
        }))
        .catch(err => ({                                       // Return when find some error 
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'application/json' },
            body: err.message
        }));
}

function checkIfInputIsValid(eventBody) {
    if (!eventBody.economico) {
        return Promise.reject(new Error('IN-001'))
    }
    if (!eventBody.modelo_id) {
        return Promise.reject(new Error('IN-004'))
    }
    return Promise.resolve();
}

function create(eventBody) {
    return checkIfInputIsValid(eventBody)                       // Test validations 
        .then(() =>
            Fridge.findOne({ economico: eventBody.economico })        //check if Fridge exists
        )
        .then(economico =>
            economico
                ? Promise.reject(new Error('IN-002'))                  //Fridge exists
                : Fridge.create(eventBody)                             //Fridge not exists, Create new fridge
        )
}
//#endregion

//#region Get
module.exports.getOne = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(() =>
            getOne(event.pathParameters.id)
        )
        .then(session => ({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session[0])
        }))
        .catch(err => ({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'application/json' },
            body: { stack: err.stack, message: err.message }
        }));
};

function getOne(FridgeId) {
    return Fridge
        .find({ "economico": FridgeId })
        .then(fridge =>
            !fridge
                ? Promise.rejected('IN-003')
                : fridge
        )
        .catch(err => Promise.reject(new Error(err)));
};
//#endregion

//#region Update
module.exports.update = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
      .then(() =>
        update(JSON.parse(event.body),
          event.pathParameters.id)                         // Call the update function
      )
      .then(session => ({
        statusCode: 200,                                   // Return when update the Agency
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      }))
      .catch(err => ({                                     // Return when find some error
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
        body: { stack: err.stack, message: err.message }
      }));
  };

function update(eventBody, FridgeId) {
    return Fridge.findByIdAndUpdate(FridgeId, eventBody, { new: true })
        .then(fridge =>
            !fridge
                ? Promise.rejected('IN-003')
                : fridge
        )
        .catch(err => Promise.reject(new Error(err)));
};
  //#endregion