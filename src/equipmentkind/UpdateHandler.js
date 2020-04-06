const mongoose = require('mongoose')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var entries = mongoose.createConnection(process.env.DB2, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
const EquipmentKindSchema = require('../../models/EquipmentKind')
const FridgeModelSchema = require('../../models/FridgeModel')
const FridgeSchema = require('../../models/Fridge')
const EntrySchema = require('../../models/Entry')
const DepartureSchema = require('../../models/Departure')
const ChangeSchema = require('../../models/Change')
var EquipmentKind = management.model('EquipmentKind', EquipmentKindSchema)
var FridgeModel = management.model('FridgeModel', FridgeModelSchema)
var Fridge = management.model('Fridge', FridgeSchema)
var Entry = entries.model('Entries', EntrySchema, 'Entries')
var Departure = entries.model('Departures', DepartureSchema, 'Departures')
var Change = entries.model('Changes', ChangeSchema, 'Changes')

async function updateEK (EquipK, EquipKid) {
  return new Promise((resolve, reject) => {
    EquipmentKind.findByIdAndUpdate(EquipKid, EquipK, { new: true },
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
  return new Promise((resolve, reject) => {
    Entry.update(
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
}

async function updateEKInDeparture (NewEK, EquipKId) {
  return new Promise((resolve, reject) => {
    Departure.update(
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
}

async function updateEKInChange (NewEK, EquipKId) {
  return new Promise((resolve, reject) => {
    Change.update(
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
    const updatedeparture = await updateEKInDeparture(response, ShapeId)
    if (!updatedeparture) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de tipo de equipo pero no de salidas'
      }
    }
    const updatechange = await updateEKInChange(response, ShapeId)
    if (!updatechange) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de tipo de equipo pero no de cambios'
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
