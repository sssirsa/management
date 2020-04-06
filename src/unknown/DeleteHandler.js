const mongoose = require('mongoose')
const UnknownSchema = require('../../models/Unknown')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Unknown = management.model('Unknown', UnknownSchema)

async function removeUnknown (Unknownid) {
  return new Promise((resolve, reject) => {
    Unknown.findByIdAndDelete(Unknownid,
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
    )
  })
}

module.exports.delete = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const Shapeid = event.pathParameters.id
  try {
    if (!Shapeid) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se ha introducido ningún id para eliminación'
      }
    }
    const response = await removeUnknown(Shapeid)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro motivo no capitalizado con el id especificado'
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
