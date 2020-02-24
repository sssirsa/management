'use strict';

const connectToDatabase = require('../../db');
const FridgeModel = require('./Fridgemodel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))          //Call the create function
    )
    .then(session => ({                         // Return when the creation it's OK
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                            // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: err.message
    }));
}

function checkIfInputIsValid(eventBody) {
  if (!eventBody.nombre) {                           // Check if contains name
    return Promise.reject(new Error('MG-010'))
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)               // Test validations
    .then(() =>
      FridgeModel.findOne({ nombre: eventBody.nombre }) //check if FridgeModel exists
    )
    .then(nombre =>
      nombre
        ? Promise.reject(new Error('MG-028'))                 //Fridgemodel exists
        : FridgeModel.create(eventBody)                       //Fridgemodel not exists, Create new fridgemodel
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion

//#region GetOne

module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                       // Call the getOne function
    )
    .then(session => ({                                     //Return when find the Fridgemodel
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,                    // Return when find some error
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getOne(FridgeModelId) {
  return FridgeModel
    .find({ _id: ObjectId(FridgeModelId) })
    .populate('marca_id')
    .populate('tipo_id')
    .then(fridgemodel =>
      !fridgemodel
        ? Promise.rejected('MG-029')                // Return error if FridgeModel not Exists
        : fridgemodel                                // Return FridgeModel
    )
    .catch(err => Promise.reject(new Error(err)));
};
//#endregion

//#region GetAll

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getAll()                                     // Call the GetAll function
    )
    .then(session => ({                           // Return when find the Fridgemodels
      statusCode: 200,
      headers: { 'Content-Type': 'applicaton/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                              // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'applicaton/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getAll() {
  return FridgeModel
    .find({})
    .populate('marca_id')
    .populate('tipo_id')
    .then(fridgemodel =>
      !fridgemodel
        ? Promise.reject('MG-030')                  // Return if not exists any fridgemodel
        : fridgemodel                               // Return fridgemodels data
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
        event.pathParameters.id)                                          //Call the update function
    )
    .then(session => ({                                                   // Return when update the Fridgemodel
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                                      // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function update(eventBody, FridgeModelId) {
  return FridgeModel.findByIdAndUpdate(FridgeModelId, eventBody, { new: true })   // Check if Fridgemodel exists
    .then(fridgemodel =>
      !fridgemodel
        ? Promise.rejected('MG-029') // Return error if FridgModel not Exists
        : fridgemodel                               // Return Updated Fridgemodel
    )
    .catch(err => Promise.reject(new Error(err)));
};

  //#endregion