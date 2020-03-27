const connectToDatabase = require('../../db')
const EquipmentKind = require('../../models/EquipmentKind')

async function findEquipmentKind () {
  return new Promise((resolve, reject) => {
    EquipmentKind.find({},
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
    ).sort({ nombre: 1 })
  })
}

module.exports.getAll = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  try {
    connectToDatabase()
    const response = await findEquipmentKind()
    if (response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No hay tipos de equipo en la base de datos'
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
