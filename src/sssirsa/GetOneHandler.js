const mongoose = require('mongoose')
const SssirsaSchema = require('../../models/Sssirsa')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Sssirsa = management.model('Sssirsa', SssirsaSchema)

async function findSssirsa (Sssirsaid) {
  return new Promise((resolve, reject) => {
    Sssirsa.findById(Sssirsaid,
      (error, docs) => {
        if (error) {
          reject(new Error({
            statusCode: 500,
            body: JSON.stringify(error),
            headers: { 'Content-Type': 'application/json' }
          }))
        }
        resolve(docs)
      }
    )
  })
}

module.exports.getOne = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const SssirsaId = event.pathParameters.id
  try {
    if (!event || !event.pathParameters || !event.pathParameters.id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se ha introducido ningún id para busqueda'
      }
    }
    const response = await findSssirsa(SssirsaId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro estatus sssirsa con el id especificado'
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
