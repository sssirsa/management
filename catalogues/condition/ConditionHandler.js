'use strict';

const connectToDatabase = require('../../db');
const Condition = require('./Condition');

//#region Create

module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(() =>
            create(JSON.parse(event.body))                    // Call the create function
        )
        .then(session => ({                                   // Return wheen the creatin it's OK
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(session)
        }))
        .catch(err => ({                                      // Return when find some error
            statusCode: err.statusCode || 500,
            headers: {'Content-Type': 'application/json'},
            body: err.message
        }));
}

function checkIfInputIsValid(eventBody) {
    if(!eventBody.letra){
        return Promise.reject(new Error('MG-018'))    // Check if contains letra
    }
    return Promise.resolve();
}

function create(eventBody) {                       // Test vaalidations
    return checkIfInputIsValid(eventBody)
      .then(() =>
      Condition.findOne({ letra: eventBody.letra }) //check if Condition exists
      )
      .then(letra =>
        letra
          ? Promise.reject(new Error('MG-019'))     // Condition exists
          : Condition.create (eventBody)            // Condition not exists, Create new Condition
      )
      .catch(err => Promise.reject(new Error(err)));
}

//#endregion

//#region GetOne

module.exports.getOne = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
       .then(() =>
           getOne(event.pathParameters.id)                  //Call the getOne function
       )
       .then(session => ({                                  // Return when find the Condition
           statusCode: 200,
           headers: { 'Content-Type': 'application/json'},
           body: JSON.stringify(session)
       }))
       .catch(err => ({                                     // Return when find some error
           statusCode: err.statusCode || 500,
           headers: { 'Content-Type': 'application/json'},
           body: {stack: err.stack, message: err.message}
       }));
};

function getOne(ConditionId){
   return Condition.findById(ConditionId)               // Check if condition exists
     .then(condition =>
       !condition 
         ? Promise.rejected('MG-020')      // Return error if Condition not Exists
         : condition                                    // Return Condition
       )
       .catch(err => Promise.reject(new Error(err)));
};
//#endregion

//#region getAll 
module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
     .then(() =>
         getAll()                                     // Call the getAll function
     )
     .then(session => ({                              // Return when find the Categories
         statusCode: 200,
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(session)
     }))
     .catch(err => ({                                 // Return when find some error
         statusCode: err.statusCode || 500,
         headers: {'Content-Type': 'application/json'},
         body: {stack: err.stack, message: err.message}
     }));
};

function getAll(){
  return Condition.find()                             //Check if any condition exists
    .then(condition =>
      !condition
        ? Promise.reject('MG-021')                    // Return if not exists any condition
        : condition                                   // Return conditions data
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
         event.pathParameters.id)             // Call the update function 
     )
     .then(session => ({                      // Return when update the Condition
         statusCode: 200,
         body: JSON.stringify(session)
     }))
     .catch(err => ({                        // Return when find some error
         statusCode: err.statusCode || 500,
         headers: { 'Content-Type': 'text/plain'},
         body: {stack: err.stack, message: err.message}
     }));
};

function update(eventBody, ConditionId){
  return Condition.findByIdAndUpdate(ConditionId,eventBody,{new:true})  // Check if Condition exists
    .then(condition =>
      !condition 
        ? Promise.rejected('MG-020')     // Return error if Condition not Exists
        : condition                                   // Return Updated Condition
      )
      .catch(err => Promise.reject(new Error(err)));
};

//#endregion

/**
 * La luna carmesi vuelve a brillar esta noche
 * Ten mucho cuidado link
 */