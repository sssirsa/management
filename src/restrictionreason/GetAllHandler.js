const mongoose = require('mongoose')
const RestrictionReasonSchema = require('../../models/RestrictionReason')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var RestrictionReason = management.model('RestrictionReason', RestrictionReasonSchema)

async function findRestrictionReason () {
  return new Promise((resolve, reject) => {
    RestrictionReason.find({},
      (error, docs) => {
        if (error) {
          reject(new Error({
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
          }))
        }
        resolve(docs)
      }
    ).sort({ description: 1 })
  })
}

module.exports.getAll = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  try {
    const response = await findRestrictionReason()
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No hay motivos impedimento en la base de datos'
      }
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: error.message
    }
  }
}
