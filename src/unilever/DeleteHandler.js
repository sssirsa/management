const connectToDatabase = require('../../db')
const Unilever = require('../../models/Unilever')

async function removeUnilever (Unileverid) {
  return new Promise((resolve, reject) => {
    Unilever.findByIdAndDelete(Unileverid,
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
    connectToDatabase()
    const response = await removeUnilever(Shapeid)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro estatus unilever con el id especificado'
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
