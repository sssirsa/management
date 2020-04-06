const mongoose = require('mongoose')
const UnileverSchema = require('../../models/Unilever')
const FridgeSchema = require('../../models/Fridge')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Unilever = management.model('Unilever', UnileverSchema)
var Fridge = management.model('Fridge', FridgeSchema)

async function updateUnilever (unilever, Unileverid) {
  return new Promise((resolve, reject) => {
    Unilever.findByIdAndUpdate(Unileverid, unilever, { new: true },
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

async function updateUnileverInFridge (Newunilever, UnileverId) {
  return new Promise((resolve, reject) => {
    Fridge.update(
      { 'estatus_unilever._id': mongoose.Types.ObjectId(UnileverId) },
      {
        $set: {
          estatus_unilever: Newunilever
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
    const response = await updateUnilever(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro estatus unilever con el id especificado'
      }
    } else {
      const update = await updateUnileverInFridge(response, ShapeId)
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
        body: 'Se han actualizado la colección de estatus unilever pero no de cabinet'
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
