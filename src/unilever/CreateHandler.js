const mongoose = require('mongoose')
const UnileverSchema = require('../../models/Unilever')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Unilever = management.model('Unilever', UnileverSchema)

async function createUnilever (unilever) {
  return new Promise((resolve, reject) => {
    Unilever.create(unilever,
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
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const Shape = JSON.parse(event.body)
  try {
    if (!Shape.code) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'Required fields: code'
      }
    }
    if (!Shape.description) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'Required fields: description'
      }
    }
    const response = await createUnilever(Shape)
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
