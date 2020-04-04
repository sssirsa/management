const connectToDatabase = require('../../db')
const connectToDatabaseEntries = require('../../db2')
const Equipmentkind = require('../../models/EquipmentKind')
const FridgeModel = require('../../models/FridgeModel')
const Fridge = require('../../models/Fridge')
const mongoose = require('mongoose')
const connection = mongoose.connection

async function updateEK (EquipK, EquipKid) {
  return new Promise((resolve, reject) => {
    Equipmentkind.findByIdAndUpdate(EquipKid, EquipK, { new: true },
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

async function updateEKInModel (NewEK, EquipKId) {
  return new Promise((resolve, reject) => {
    FridgeModel.update(
      { 'tipo._id': mongoose.Types.ObjectId(EquipKId) },
      {
        $set: {
          tipo: NewEK
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

async function updateEKInFridge (NewEK, EquipKId) {
  return new Promise((resolve, reject) => {
    Fridge.update(
      { 'modelo.tipo._id': mongoose.Types.ObjectId(EquipKId) },
      {
        $set: {
          'modelo.tipo': NewEK
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

async function updateEKInEntry (NewEK, EquipKId) {
  connectToDatabaseEntries()
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line handle-callback-err
    connection.db.collection('Entries', function (err, collection) {
      collection.update(
        { 'cabinets.modelo.tipo._id': mongoose.Types.ObjectId(EquipKId) },
        {
          $set: {
            'cabinets.$.modelo.tipo': NewEK
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
    connectToDatabase()
    const response = await updateEK(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro tipo equipo con el id especificado'
      }
    }
    const updatefride = await updateEKInFridge(response, ShapeId)
    if (!updatefride) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de tipo de equipo pero no de cabinet'
      }
    }
    const updatemodel = await updateEKInModel(response, ShapeId)
    if (!updatemodel) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de tipo de equipo pero no de modelo'
      }
    }
    const updateentry = await updateEKInEntry(response, ShapeId)
    if (!updateentry) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de tipo de equipo pero no de entradas'
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
