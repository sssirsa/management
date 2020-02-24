'use strict';

const connectToDatabase = require('../../db');
const Unilever = require('../../models/Unilever');

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))                    // Call the create function
    )
    .then(session => ({                                   // Return when the creation it's OK
      statusCode: 200,
      headers: { 'Content-Tyoe': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                      // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: err.message
    }));
}

function checkIfInputIsValid(eventBody) {
  if (!eventBody.code) {                                                      // Check if contains code
    return Promise.reject(new Error('MG-014'))
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)             // Test validations
    .then(() =>
      Unilever.findOne({ code: eventBody.code }).lean()      //check if unilever status exists
    )
    .then(nombre =>
      nombre
        ? Promise.reject(new Error('MG-015'))
        : Unilever.create(eventBody)
    )
    .catch(err => Promise.reject(new Error(err)));
}

//#endregion

//#region GetOne

module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                  // Call the getOne function
    )
    .then(session => ({                                  // Return when find the Unilever Status
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                    // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getOne(UnileverStatusId) {
  return Unilever.findById(UnileverStatusId)               // Check if unilever status exists
    .then(unilever =>
      !unilever
        ? Promise.rejected('MG-016')    // Return error if Unilever Status not Exists
        : unilever                                         // Return Unilever Status
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion


//#region  GetAll

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getAll()                                           //Call the GetAll functions
    )
    .then(session => ({                                    // Return when find Unilever Status
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                      // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getAll() {
  return Unilever.find().lean()                                    // Check if any agency exists
    .then(unilever =>
      !unilever
        ? Promise.reject('MG-017')                          // Return if not exists any unilever status
        : unilever                                          // Return unilever status data
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
        event.pathParameters.id)                          // Call the update function
    )
    .then(session => ({                                   // Return when update the Unilever Status
      statusCode: 200,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,                   // Return when find some error
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function update(eventBody, UnileverStatusId) {
  return Unilever.findByIdAndUpdate(UnileverStatusId, eventBody, { new: true }).lean()   // Check if Unilever Status exists
    .then(unilever =>
      !unilever
        ? Promise.rejected('MG-016')  // Return error if Unilever Status not Exists
        : unilever                    // Return Updated Unilever Status
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion