'use strict';

const connectToDatabase = require('../../db');
const Equipmentkind = require('../../models/Equipmentkind');

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
    return Equipmentkind.findByIdAndUpdate(EquipmentkindId, eventBody, { new: true }).lean()     // Check if Equipmentkind exists
      .then(equipmentkind =>
        !equipmentkind
          ? Promise.rejected('MG-023')   // Return error if Equipmentkind not Exists
          : equipmentkind                                 // Return Updated Equipmentkind
      )
      .catch(err => Promise.reject(new Error(err)));
  };
  