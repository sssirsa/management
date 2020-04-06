const mongoose = require('mongoose')
const SssirsaSchema = require('../../models/Sssirsa')
const FridgeSchema = require('../../models/Fridge')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Sssirsa = management.model('Sssirsa', SssirsaSchema)
var Fridge = management.model('Fridge', FridgeSchema)

async function updateSssirsa (sssirsa, SssirsaId) {
  return new Promise((resolve, reject) => {
    Sssirsa.findByIdAndUpdate(SssirsaId, sssirsa, { new: true },
      (error, docs) => {
        if (error) {
          reject(new Error({
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
          }))
        }
        resolve(docs)
      }).lean()
  })
}

async function updateSssirsaInFridge (Newsssirsa, SssirsaId) {
  return new Promise((resolve, reject) => {
    Fridge.update(
      { 'estatus_sssirsa._id': mongoose.Types.ObjectId(SssirsaId) },
      {
        $set: {
          estatus_sssirsa: Newsssirsa
        }
      },
      { multi: true },
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

module.exports.update = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const ShapeId = event.pathParameters.id
  const Shape = JSON.parse(event.body)
  try {
    if (!ShapeId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se ha introducido ningún id para actualización'
      }
    }
    const response = await updateSssirsa(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro estatus sssirsa con el id especificado'
      }
    } else {
      const update = await updateSssirsaInFridge(response, ShapeId)
      if (update) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        }
      }
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de estatus sssirsa pero no de cabinet'
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: error.message
    }
  }
}
