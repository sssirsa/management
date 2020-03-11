'use strict';

const connectToDatabase = require('../../db');
const FridgeModel = require('../../models/Fridgemodel');
const mongoose = require('mongoose');


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
  