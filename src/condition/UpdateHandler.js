'use strict'

const connectToDatabase = require('../../db');
const Condition = require('../../models/Condition');

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
    return Condition.findByIdAndUpdate(ConditionId,eventBody,{new:true}).lean()  // Check if Condition exists
      .then(condition =>
        !condition 
          ? Promise.rejected('MG-020')     // Return error if Condition not Exists
          : condition                                   // Return Updated Condition
        )
        .catch(err => Promise.reject(new Error(err)));
  };