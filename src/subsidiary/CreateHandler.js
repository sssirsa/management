const connectToDatabase = require('../../db')
const Subsidiary = require('../../models/Subsidiary')

async function createSubsidiary (subsidiary) {
  return new Promise((resolve, reject) => {
    Subsidiary.create(subsidiary,
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

module.exports.create = async (event, context) => {
  const mongoconnection = context
  mongoconnection.callbackWaitsForEmptyEventLoop = false
  const Shape = JSON.parse(event.body)
  try {
    if (!Shape.nombre || !Shape.direccion) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'Required fields: nombre, direccion'
      }
    }
    connectToDatabase()
    const response = await createSubsidiary(Shape)
    return {
      statusCode: 201,
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
