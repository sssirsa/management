'use strict';

const connectToDatabase = require('../../db');
const UnknownStatus = require('./UnknownStatus');

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))                // Call the create function
    )
    .then(session => ({                               // Return when the cration it's OK
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                  // Return when find some errors.
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: err.message
    }));
}

function checkIfInputIsValid(eventBody) {
  if (!eventBody.nombre) {                            // Check if contains name
    return Promise.reject(new Error('MG-010'))
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)               // Test validations
    .then(() =>
      UnknownStatus.findOne({ nombre: eventBody.nombre }) //check if UnknownStatus exists
    )
    .then(nombre =>
      nombre
        ? Promise.reject(new Error('MG-031'))       // UnknownStatus exists
        : UnknownStatus.create(eventBody)                                        // UnknownStatus not exists, Create new unknownstatus
    )
    .catch(err => Promise.reject(new Error(err)));
}

//#endregion

//#region Get

/**
 * Functions
 */

module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                            // Call the getOne function
    )
    .then(session => ({                                            // Retur when find the UNknownStatus
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,                         // Return when find some error
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getOne(UnknownStatusId) {
  return UnknownStatus.findById(UnknownStatusId)                      // Check if unknownStatus exists
    .then(unknownstatus =>
      !unknownstatus
        ? Promise.rejected('MG-032')                  // Return error if unknownStatusnot Exists
        : unknownstatus                                                // Return UnknownStatus
    )
    .catch(err => Promise.reject(new Error(err)));
};


//#endregion

//#region GetAll

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getAll()                                                   // Check if UnknownStatus exists
    )
    .then(session => ({                                            // Return when find the UnknownStatus
      statusCode: 200,
      headers: { 'Content-Type': 'application/json'  },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                                // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json'  },
      body: { stack: err.stack, message: err.message }
    }));
};

function getAll() {
  return UnknownStatus.find()                                         // Check if any unknownstatus exists
    .then(unknownstatus =>
      !unknownstatus
        ? Promise.reject('MG-033')                   // Return if not exists any unknownstatus
        : unknownstatus                                               // Return unknownstatus data
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
        event.pathParameters.id)                              // Call the update function
    )
    .then(session => ({                                       // Return when update the UnknownStatus
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                          // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function update(eventBody, UnknownStatusId) {
  return UnknownStatus.findByIdAndUpdate(UnknownStatusId, eventBody, { new: true })   // Check if Unknownstatus exists
    .then(unknownstatus =>
      !unknownstatus
        ? Promise.rejected('MG-032')    // Return error if UnknownStatus not Exists
        : unknownstatus                 // Return Updated UnknownStatus
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion