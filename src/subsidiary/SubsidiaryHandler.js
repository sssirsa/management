'use strict';

const connectToDatabase = require('../../db');
const Subsidiary = require('./Subsidiary');

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))                  // Call the create function
    )
    .then(session => ({                                 // Return when the creation it's OK
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                    // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: err.message
    }));
}

function checkIfInputIsValid(eventBody) {
  if (!eventBody.nombre) {
    return Promise.reject(new Error('MG-010'))          // Check if contains name
  }
  if (!eventBody.direccion) {
    return Promise.reject(new Error('MG-006'))          // Check if contains address
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)                   // Test validations
    .then(() =>
      Subsidiary.findOne({ nombre: eventBody.nombre })    //check if subsidiary exists
    )
    .then(nombre =>
      nombre
        ? Promise.reject(new Error('MG-011'))             // Subsidiary exists
        : Subsidiary.create(eventBody)                   // Subsidiary not exists, Create new subsidiary
    )
    .catch(err => Promise.reject(new Error(err)));
}

//#endregion

//#region getOne

module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                     // Call the getOne function
    )
    .then(session => ({
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },       // Return when find the Subsidiary
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,                  // Return when find some error
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getOne(SubsidiaryId) {
  return Subsidiary.findById(SubsidiaryId)              // Check if subsidiary exists
    .then(subsidiary =>
      !subsidiary
        ? Promise.rejected('MG-012')      // Return error if Subsidiary not Exists
        : subsidiary                                    // Return Subsidiary
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion

//#region getAll

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getAll()                                          // Call the getAll function
    )
    .then(session => ({                                 // Return when find the Subsidiaries
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

function getAll() {
  return Subsidiary.find()                              // Check if any subsidiary exists
    .then(subsidiary =>
      !subsidiary
        ? Promise.reject('MG-013')        // Return if not exists any subsidiary
        : subsidiary                                    // Return subsidiaries data
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion

//#region Update

module.exports.update = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      update(JSON.parse(event.body),                        // Call the update function
        event.pathParameters.id)
    )
    .then(session => ({                                     // Return when update the Subsidiary 
      statusCode: 200,
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(session)
    })) 
    .catch(err => ({                                        // Return when find some error
      statusCode: err.statusCode || 500,            
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};

function update(eventBody, SubsidiaryId) {
  return Subsidiary.findByIdAndUpdate(SubsidiaryId, eventBody, { new: true })   // Check if Subsidiary exists
    .then(subsidiary =>
      !subsidiary
        ? Promise.rejected('MG-012')            // Return error if Subsidiary not Exists
        : subsidiary                                          // Return Updated Subsidiary
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion