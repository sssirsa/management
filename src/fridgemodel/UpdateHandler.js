const mongoose = require('mongoose')
const FridgeModelSchema = require('../../models/FridgeModel')
const FridgeBrandSchema = require('../../models/FridgeBrand')
const EquipmentKindSchema = require('../../models/EquipmentKind')
const FridgeSchema = require('../../models/Fridge')
const EntrySchema = require('../../models/Entry')
const DepartureSchema = require('../../models/Departure')
const ChangeSchema = require('../../models/Change')
var entries = mongoose.createConnection(process.env.DB2, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var FridgeModel = management.model('FridgeModel', FridgeModelSchema)
var FridgeBrand = management.model('FridgeBrand', FridgeBrandSchema)
var EquipmentKind = management.model('EquipmentKind', EquipmentKindSchema)
var Fridge = management.model('Fridge', FridgeSchema)
var Entry = entries.model('Entries', EntrySchema, 'Entries')
var Departure = entries.model('Departures', DepartureSchema, 'Departures')
var Change = entries.model('Changes', ChangeSchema, 'Changes')

async function updateFM (FridgeM, FridgeMid) {
  return new Promise((resolve, reject) => {
    FridgeModel.findByIdAndUpdate(FridgeMid, FridgeM, { new: true },
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

async function updateFMInFridge (NewFM, FridgeMId) {
  return new Promise((resolve, reject) => {
    Fridge.update(
      { 'modelo._id': mongoose.Types.ObjectId(FridgeMId) },
      {
        $set: {
          modelo: NewFM
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

async function updateFMInEntry (NewFM, FridgeMId) {
  return new Promise((resolve, reject) => {
    Entry.update(
      { 'cabinets.modelo._id': mongoose.Types.ObjectId(FridgeMId) },
      {
        $set: {
          'cabinets.$.modelo': NewFM
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

async function updateFMInDeparture (NewFM, FridgeMId) {
  return new Promise((resolve, reject) => {
    Departure.update(
      { 'cabinets.modelo._id': mongoose.Types.ObjectId(FridgeMId) },
      {
        $set: {
          'cabinets.$.modelo': NewFM
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

async function updateFMInChange (NewFM, FridgeMId) {
  return new Promise((resolve, reject) => {
    Change.update(
      { 'cabinets.modelo._id': mongoose.Types.ObjectId(FridgeMId) },
      {
        $set: {
          'cabinets.$.modelo': NewFM
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

async function SearchBrand (brandId) {
  return new Promise(function (resolve, reject) {
    try {
      FridgeBrand.findById(brandId,
        function (error, docs) {
          if (error) {
            reject(new Error({
              statusCode: 500,
              headers: { 'Content-Type': 'application/json' },
              body: error.toString()
            }))
            return
          }
          if (!docs) {
            reject(new Error({
              statusCode: 400,
              headers: { 'Content-Type': 'application/json' },
              body: 'No se encontro marca con el id especificado'
            }))
          }
          resolve(docs)
        }
      )
    } catch (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: error.message
      }
    }
  })
}

async function SearchEquipment (equipmentId) {
  return new Promise(function (resolve, reject) {
    try {
      EquipmentKind.findById(equipmentId,
        function (error, docs) {
          if (error) {
            reject(new Error({
              statusCode: 500,
              headers: { 'Content-Type': 'application/json' },
              body: error.toString()
            }))
            return
          }
          if (!docs) {
            reject(new Error({
              statusCode: 400,
              headers: { 'Content-Type': 'application/json' },
              body: 'No se encontro tipo de equipo con el id especificado'
            }))
          }
          resolve(docs)
        }
      )
    } catch (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: error.message
      }
    }
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
    if (Shape.marca_id) {
      Shape.marca = await SearchBrand(Shape.marca_id)
    }
    if (Shape.tipo_id) {
      Shape.tipo = await SearchEquipment(Shape.tipo_id)
    }
    const response = await updateFM(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro modelo con el id especificado'
      }
    }
    const updatefride = await updateFMInFridge(response, ShapeId)
    if (!updatefride) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de modelo pero no de cabinet'
      }
    }
    const updateentry = await updateFMInEntry(response, ShapeId)
    if (!updateentry) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de modelo pero no de entradas'
      }
    }
    const updatedeparture = await updateFMInDeparture(response, ShapeId)
    if (!updatedeparture) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de modelo pero no de salidas'
      }
    }
    const updatechange = await updateFMInChange(response, ShapeId)
    if (!updatechange) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: 'Se han actualizado la colección de modelo pero no de cambios'
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
