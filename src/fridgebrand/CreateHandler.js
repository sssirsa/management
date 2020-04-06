const mongoose = require('mongoose')
const FridgeBrandSchema = require('../../models/FridgeBrand')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var FridgeBrand = management.model('FridgeBrand', FridgeBrandSchema)

async function createFridgeBrand (fridgebrand) {
  return new Promise((resolve, reject) => {
    FridgeBrand.create(fridgebrand,
      (error, docs) => {
        if (error) {
          reject(new Error({
            statusCode: 500,
            body: JSON.stringify(error),
            headers: { 'Content-Type': 'applicatio/json' }
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
    if (!Shape.nombre) {
      return {
        statusCode: 400,
        headers: { 'Context-Type': 'application/json' },
        body: 'Required fields: nombre'
      }
    }
    const response = await createFridgeBrand(Shape)
    return {
      statusCode: 201,
      headers: { 'content-Type': 'application/json' },
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
