const mongoose = require('mongoose')
const FridgeModelSchema = require('../../models/FridgeModel')
const FridgeBrandSchema = require('../../models/FridgeBrand')
const EquipmentKindSchema = require('../../models/EquipmentKind')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var FridgeModel = management.model('FridgeModel', FridgeModelSchema)
var FridgeBrand = management.model('FridgeBrand', FridgeBrandSchema)
var EquipmentKind = management.model('EquipmentKind', EquipmentKindSchema)

async function createFridgeModel (fridgemodel) {
  return new Promise((resolve, reject) => {
    FridgeModel.create(fridgemodel,
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

module.exports.create = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const fridgemodel = JSON.parse(event.body)
  try {
    if (!fridgemodel.marca_id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'Required fields: marca_id'
      }
    }
    if (!fridgemodel.tipo_id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'Required fields: tipo_id'
      }
    }
    if (!fridgemodel.nombre) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'Required fields: nombre'
      }
    }
    const marca = await SearchBrand(fridgemodel.marca_id)
    const tipo = await SearchEquipment(fridgemodel.tipo_id)
    var Shape = {
      nombre: fridgemodel.nombre,
      marca: marca,
      tipo: tipo
    }
    const response = await createFridgeModel(Shape)
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
