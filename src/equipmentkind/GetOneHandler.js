const connectToDatabase = require('../../db')
const EquipmentKind = require('../../models/EquipmentKind')

async function findEquipmentKind (EquipmentKindid) {
  return new Promise((resolve, reject) => {
    EquipmentKind.findById(EquipmentKindid,
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

module.exports.getOne = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const ShapeId = event.pathParameters.id
  try {
    if (!ShapeId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se ha introducido ningún id para busqueda'
      }
    }
    connectToDatabase()
    const response = await findEquipmentKind(ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro tipo de equipo con el id especificado'
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
