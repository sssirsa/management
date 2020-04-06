const mongoose = require('mongoose')
const SssirsaSchema = require('../../models/Sssirsa')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Sssirsa = management.model('Sssirsa', SssirsaSchema)

async function findSssirsa () {
  return new Promise((resolve, reject) => {
    Sssirsa.find({},
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
    ).sort({ code: 1 })
  })
}

module.exports.getAll = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  try {
    const response = await findSssirsa()
    if (response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No hay estados sssirsa en la base de datos'
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
