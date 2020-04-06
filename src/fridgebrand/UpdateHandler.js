const mongoose = require('mongoose')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var entries = mongoose.createConnection(process.env.DB2, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
const FridgeBrandSchema = require('../../models/FridgeBrand')
const FridgeModelSchema = require('../../models/FridgeModel')
const FridgeSchema = require('../../models/Fridge')
const EntrySchema = require('../../models/Entry')
const DepartureSchema = require('../../models/Departure')
const ChangeSchema = require('../../models/Change')
var FridgeBrand = management.model('FridgeBrand', FridgeBrandSchema)
var FridgeModel = management.model('FridgeModel', FridgeModelSchema)
var Fridge = management.model('Fridge', FridgeSchema)
var Entry = entries.model('Entries', EntrySchema, 'Entries')
var Departure = entries.model('Departures', DepartureSchema, 'Departures')
var Change = entries.model('Changes', ChangeSchema, 'Changes')

async function updateFB (FridgeB, FridgeBid) {
  return new Promise((resolve, reject) => {
    FridgeBrand.findByIdAndUpdate(FridgeBid, FridgeB, { new: true },
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

async function updateFBInModel (NewFB, FridgeBId) {
  return new Promise((resolve, reject) => {
    FridgeModel.update(
      { 'marca._id': mongoose.Types.ObjectId(FridgeBId) },
      {
        $set: {
          tipo: NewFB
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

async function updateFBInFridge (NewFB, FridgeBId) {
  return new Promise((resolve, reject) => {
    Fridge.update(
      { 'modelo.marca._id': mongoose.Types.ObjectId(FridgeBId) },
      {
        $set: {
          'modelo.marca': NewFB
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

async function updateFBInEntry (NewFB, FridgeBId) {
  return new Promise((resolve, reject) => {
    Entry.update(
      { 'cabinets.modelo.marca._id': mongoose.Types.ObjectId(FridgeBId) },
      {
        $set: {
          'cabinets.$.modelo.marca': NewFB
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

async function updateFBInDeparture (NewFB, FridgeBId) {
  return new Promise((resolve, reject) => {
    Departure.update(
      { 'cabinets.modelo.marca._id': mongoose.Types.ObjectId(FridgeBId) },
      {
        $set: {
          'cabinets.$.modelo.marca': NewFB
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

async function updateFBInChange (NewFB, FridgeBId) {
  return new Promise((resolve, reject) => {
    Change.update(
      { 'cabinets.modelo.marca._id': mongoose.Types.ObjectId(FridgeBId) },
      {
        $set: {
          'cabinets.$.modelo.marca': NewFB
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
    const response = await updateFB(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro marca con el id especificado'
      }
    }
    const updatefride = await updateFBInFridge(response, ShapeId)
    if (!updatefride) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de marca pero no de cabinet'
      }
    }
    const updatemodel = await updateFBInModel(response, ShapeId)
    if (!updatemodel) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de marca pero no de modelo'
      }
    }
    const updateentry = await updateFBInEntry(response, ShapeId)
    if (!updateentry) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de marca pero no de entradas'
      }
    }
    const updatedeparture = await updateFBInDeparture(response, ShapeId)
    if (!updatedeparture) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de marca pero no de salidas'
      }
    }
    const updatechange = await updateFBInChange(response, ShapeId)
    if (!updatechange) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de marca pero no de cambios'
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
