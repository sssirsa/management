'use strict';

const connectToDatabase = require('../../db');
const Equipmentkind = require('./Equipmentkind');

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))                  // Call the function create
    )
    .then(session => ({                                 // Return whrn the creation it's OK
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
  if (!eventBody.nombre) {                                  // Check if contains nombre
    return Promise.reject(new Error('MG-010'))
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)                 // Test validations
    .then(() =>
      Equipmentkind.findOne({ nombre: eventBody.nombre }) //check if Equipmentkind exists
    )
    .then(nombre =>
      nombre
        ? Promise.reject(new Error('MG-022'))           // Equipmentkind exists
        : Equipmentkind.create(eventBody)              // Equipmentkind not exists, Create new equipmentkind
    )
    .catch(err => Promise.reject(new Error(err)));
}

//#endregion

//#region GetOne

module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                    // Call the findOne function
    )
    .then(session => ({                                    // Return when find the Equipmentkind
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


function getOne(EquipmentkindId) {
  return Equipmentkind.findById(EquipmentkindId)          // Check if equipmentkind exists
    .then(equipmentkind =>
      !equipmentkind
        ? Promise.rejected('MG-023')          // Return error if Equipment not Exists
        : equipmentkind                                        // Return Equipmentkind
    )
    .catch(err => Promise.reject(new Error(err)));
};


//#endregion

//#region GetAll

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getAll()                                           // Call the getAll function
    )
    .then(session => ({                                    // Return when find the Equipmentkinds
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

function getAll() {
  return Equipmentkind.find()                               // Check if any equipmentkind exists
    .then(equipmentkind =>
      !equipmentkind
        ? Promise.reject('MG-024')                            // Return if not exists any equipmentkind
        : equipmentkind                                      // Return equipmentkind data
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
    .then(session => ({                                   // Return when update the Agency
      statusCode: 200,
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                     // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function update(eventBody, EquipmentkindId) {
  return Equipmentkind.findByIdAndUpdate(EquipmentkindId, eventBody, { new: true })     // Check if Equipmentkind exists
    .then(equipmentkind =>
      !equipmentkind
        ? Promise.rejected('MG-023')   // Return error if Equipmentkind not Exists
        : equipmentkind                                 // Return Updated Equipmentkind
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion