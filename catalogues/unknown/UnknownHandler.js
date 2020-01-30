'use strict';

const connectToDatabase = require('../../db');
const Unknown = require('./Unknown');

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))                // Call the create function
    )
    .then(session => ({                               // Return when the creation it's OK
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                  // Return when find some errors
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: err.message
    }));
}

/**
 * Helpers Create
 */

function checkIfInputIsValid(eventBody) {
  if (!eventBody.nombre) {                          // Check if contains name
    return Promise.reject(new Error('MG-010'))
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)           // Test validations
    .then(() =>
      Unknown.findOne({ nombre: eventBody.nombre }) //check if Unknown exists
    )
    .then(nombre =>
      nombre
        ? Promise.reject(new Error('MG-034'))
        : Unknown.create(eventBody)
    )
}

//#endregion

//#region GetOne


module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                      // Call the getOne function
    )
    .then(session => ({                                      //Return when find the Unknown
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,                   // Return when find some error
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getOne(UnknownId) {
  return Unknown.findById(UnknownId)                         // Check if Unknown exists
    .then(unknown =>
      !unknown
        ? Promise.rejected('MG-035')                         // Return error if Unknown not Exists
        : unknown                                            // Return Unknown
    )
    .catch(err => Promise.reject(new Error(err)));
};


//#endregion

//#region GetAll
module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getAll()                                             // Call the GetAll function
    )
    .then(session => ({                                      // Return when find the Unknown
      statusCode: 200,
      headers: { 'Content-Type': 'applicaton/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                         // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'applicaton/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getAll() {
  return Unknown.find()                                       // Check if any unknown exists
    .then(unknown =>
      !unknown
        ? Promise.reject('MG-036')                               // Return if not exists any unknown
        : unknown                                                // Return unknowns data
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
        event.pathParameters.id)                          //Call the update function
    )
    .then(session => ({                                    // Return when update the Unknown
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                       // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function update(eventBody, UnknownId) {
  return Unknown.findByIdAndUpdate(UnknownId, eventBody, { new: true })
    .then(unknown =>
      !unknown
        ? Promise.rejected('MG-035')                        // Return error if Unknown not Exists
        : unknown                                            // Return Updated Unknown
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion