const mongoose = require('mongoose')
const SubsidiarySchema = require('../../models/Subsidiary')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Subsidiary = management.model('Subsidiary', SubsidiarySchema)

async function createSubsidiary (subsidiary) {
  return new Promise((resolve, reject) => {
    Subsidiary.create(subsidiary,
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

module.exports.create = async (event, context) => {
  const mongoconnection = context
  mongoconnection.callbackWaitsForEmptyEventLoop = false
  const Shape = JSON.parse(event.body)
  try {
    if (!Shape.nombre) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'Required fields: nombre'
      }
    }
    if (!Shape.direccion) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'Required fields: direccion'
      }
    }
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
