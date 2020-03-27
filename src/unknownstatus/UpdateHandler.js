const connectToDatabase = require('../../db')
const UnknownStatus = require('../../models/UnknownStatus')

async function updateUnknownStatus (unknownstatus, UnknownStatusid) {
  return new Promise((resolve, reject) => {
    UnknownStatus.findByIdAndUpdate(UnknownStatusid, unknownstatus, { new: true },
      (error, docs) => {
        if (error) {
          reject(new Error({
            statusCode: 500,
            body: JSON.stringify(error),
            headers: { 'Content-Type': 'application/json' }
          }))
        }
        resolve(docs)
      }).lean()
  })
}

module.exports.update = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const ShapeId = event.pathParameters.id
  const Shape = JSON.parse(event.body)
  try {
    if (!event || !event.pathParameters || !event.pathParameters.id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se ha introducido ningún id para busqueda'
      }
    }
    connectToDatabase()
    const response = await updateUnknownStatus(Shape, ShapeId)
    if (response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro estatus no capitalizado con el id especificado'
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
