const mongoose = require('mongoose')
const SubsidiarySchema = require('../../models/Subsidiary')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Subsidiary = management.model('Subsidiary', SubsidiarySchema)

async function removeSubsidiary (Subsidiaryid) {
  return new Promise((resolve, reject) => {
    Subsidiary.findByIdAndDelete(Subsidiaryid,
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
    const response = await removeSubsidiary(Shapeid)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro sucursal con el id especificado'
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
