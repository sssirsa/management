const connectToDatabase = require('../../db')
const RestrictionReason = require('../../models/RestrictionReason')

async function updateRestrictionReason (restrictionreason, RestrictionReasonid) {
  return new Promise((resolve, reject) => {
    RestrictionReason.findByIdAndUpdate(RestrictionReasonid, restrictionreason, { new: true },
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
    const response = await updateRestrictionReason(Shape, ShapeId)
    if (response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro restriccion con el id especificado'
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
