'use strict';

const connectToDatabase = require('../../db');
const FridgeBrand = require('../../models/FridgeBrand');

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
    return FridgeBrand.findByIdAndUpdate(FridgeBrandId, eventBody, { new: true }).lean()     // Check if FridgeBrand exists
      .then(fridgebrand =>
        !fridgebrand
          ? Promise.rejected('No fridgebrand found.')       //Return error if FridgeBrands not Exists
          : fridgebrand                                     // Return Updated Fridgebrand
      )
      .catch(err => Promise.reject(new Error(err)));
  };
  