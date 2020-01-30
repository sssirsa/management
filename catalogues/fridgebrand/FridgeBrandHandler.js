'use strict';

const connectToDatabase = require('../../db');
const FridgeBrand = require('./FridgeBrand');

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))                    // Call the create function
    )
    .then(session => ({                                   // Return when the creation it's OK
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                      // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: err.message
    }));
}

function checkIfInputIsValid(eventBody) {
  if (!eventBody.nombre) {                                     // Check if ccontains name
    return Promise.reject(new Error('MG-010'))
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)
    .then(() =>
      FridgeBrand.findOne({ nombre: eventBody.nombre }) //check if FridgeBrand exists
    )
    .then(nombre =>
      nombre
        ? Promise.reject(new Error('MG-025'))         // FridgeBrand exists
        : FridgeBrand.create(eventBody)              // FridgeBrand not exists, Create new FridgeBrand
    )
    .catch(err => Promise.reject(new Error(err)));
}

//#endregion

//#region Get

module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                    // Caall the getOne function
    )
    .then(session => ({                                    // Return when find the FridgeBrand
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

function getOne(FridgeBrandId) {
  return FridgeBrand.findById(FridgeBrandId)                 // Check if fridgebrand exists
    .then(fridgebrand =>
      !fridgebrand
        ? Promise.rejected('MG-026')                         // Return error If fridgebrand not Exists
        : fridgebrand                                        // Return fridgebrand
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
    .then(session => ({                                      // Return when find the FridgeBrands
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                         // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getAll() {
  return FridgeBrand.find()                                   // Check if any fridgebrands exists
    .then(fridgebrand =>
      !fridgebrand
        ? Promise.reject('MG-027')                            // Return if not exists any fridgebrand
        : fridgebrand                                         // Return fridgebrands data
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
        event.pathParameters.id)                            //Call the update function
    )
    .then(session => ({                                     // Return when update the Fridgebrand
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                        // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function update(eventBody, FridgeBrandId) {
  return FridgeBrand.findByIdAndUpdate(FridgeBrandId, eventBody, { new: true })     // Check if FridgeBrand exists
    .then(fridgebrand =>
      !fridgebrand
        ? Promise.rejected('No fridgebrand found.')       //Return error if FridgeBrands not Exists
        : fridgebrand                                     // Return Updated Fridgebrand
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion