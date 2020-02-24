'use strict';

const connectToDatabase = require('../../db');
const Agency = require('../../models/Agency');

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))                   // Call the create function
    )
    .then(session => ({                                // Return when the creation it's OK 
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                   // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: err.message
    }));
}

function checkIfInputIsValid(eventBody) {
  if (!eventBody.agencia) {                            // Check if contains agency
    return Promise.reject(new Error('MG-005'))
  }
  if (!eventBody.direccion) {                          // Check if contains address
    return Promise.reject(new Error('MG-006'))
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)                // Test validations 
    .then(() =>
      Agency.findOne({ agencia: eventBody.agencia })   // Check if agency exists
    )
    .then(agency =>
      agency
        ? Promise.reject(new Error('MG-007'))          // Agency exists
        : Agency.create(eventBody)                     // Agency not exists, Create new agency
    )
    .catch(err => Promise.reject(new Error(err)));
}

//#endregion

//#region GetOne


module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                   //Call the getOne function 
    )
    .then(session => ({
      statusCode: 200,                                  //Return when find the Agency 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,                // Return when find some error
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getOne(AgencyId) {
  return Agency.findById(AgencyId).lean()                      //Check if agency exists
    .then(agency =>
      !agency
        ? Promise.rejected('MG-008')                    // Return error if Agency not Exists
        : agency                                        // Return Agency
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
    .then(session => ({                                 // Return when find the Agencies
      statusCode: 200,
      headers: { 'Content-Type': 'applicaton/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                    // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getAll() {
  return Agency.find().lean()                                  // Check if any agency exists
    .then(agency =>
      !agency
        ? Promise.reject('MG-009')                      // Return if not exists any agency
        : agency                                        // Return agencies data
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

function update(eventBody, AgencyId) {
  return Agency.findByIdAndUpdate(AgencyId, eventBody, { new: true }).lean()   // Check if Agency exists
    .then(agency =>
      !agency
        ? Promise.rejected('MG-008') // Return error if Agency not Exists
        : agency                     // Return Updated Agency
    )
    .catch(err => Promise.reject(new Error(err)));
};

//#endregion