'use strict';

const connectToDatabase = require('../../db');
const Agency = require('../../models/Agency');

module.exports.update = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(() =>
            update(JSON.parse(event.body),
                event.pathParameters.id)
        )
        .then(session => ({
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


function update(eventBody, AgencyId) {
    return Agency.findByIdAndUpdate(AgencyId, eventBody, { new: true }).lean()   // Check if Agency exists
      .then(agency =>
        !agency
          ? Promise.rejected('MG-008') // Return error if Agency not Exists
          : agency                     // Return Updated Agency
      )
      .catch(err => Promise.reject(new Error(err)));
  };
  