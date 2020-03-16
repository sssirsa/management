'use strict';

const connectToDatabase = require('../../db');
const RestrictionReason = require('../../models/RestrictionReason');

//#region Create

module.exports.create = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      create(JSON.parse(event.body))                          //Call the create function
    )
    .then(session => ({                                         // Return when the creation it's OK
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                            // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: err.message
    }));
}

function checkIfInputIsValid(eventBody) {
  if (!eventBody.description) {                       // Check if contains descripcion
    return Promise.reject(new Error('MG-037'))
  }
  return Promise.resolve();
}

function create(eventBody) {
  return checkIfInputIsValid(eventBody)                           // Test validations
    .then(() =>
      RestrictionReason.findOne({ description: eventBody.description }).lean()   //check if RestrictionReason exists
    )
    .then(description =>
      description
        ? Promise.reject(new Error('MG-038'))                           // RestrictionReason exists
        : RestrictionReason.create(eventBody)                          //RestrictionReason not exists, Create new RestrictionReason    
    )
}

//#endregion

//#region GetOne

module.exports.getOne = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getOne(event.pathParameters.id)                    // Call the getOne function
    )
    .then(session => ({                                  //Return when find the RestrictionReason
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                     // Return when find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getOne(RestrictionReasonId) {
  return RestrictionReason.findById(RestrictionReasonId).lean()            // Check if RestrictionReason exists
    .then(restrictionreason =>
      !restrictionreason
        ? Promise.rejected('MG-039')                                 // Return error if RestrictionReason not Exists
        : restrictionreason                                          // Return RestrictionReason
    )
    .catch(err => Promise.reject(new Error(err)));
};


//#endregion

//#region GetAll
module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getAll()                                         // Call the GetAll functions
    )
    .then(session => ({                                  // Return when find the RestrictionReasons
      statusCode: 200,
      headers: { 'Content-Type': 'applicaton/json' },
      body: JSON.stringify(session)
    }))
    .catch(err => ({                                     // Return wen find some error
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'applicaton/json' },
      body: { stack: err.stack, message: err.message }
    }));
};

function getAll() {
  return RestrictionReason.find().lean()                         // Check if any Restrictionreason exists
    .then(restrictionreason =>
      !restrictionreason
        ? Promise.reject('MG-040')   // Return if not exists any restrictionreason
        : restrictionreason                               // Return restrictionreasons data
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
        event.pathParameters.id)                              //Call the update function
    )
    .then(session => ({                                       // Return when update the RestrictionReason
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

function update(eventBody, RestrictionReasonId) {
  return RestrictionReason.findByIdAndUpdate(RestrictionReasonId, eventBody, { new: true }).lean()     // Check if RestrictionReason exists
    .then(restrictionreason =>
      !restrictionreason
        ? Promise.rejected('MG-039') // Return error if FridgModel not Exists
        : restrictionreason          // Return Updated Fridgemodel
    )
    .catch(err => Promise.reject(new Error(err)));

};

//#endregion