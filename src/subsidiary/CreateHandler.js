var Subsidiary = require('../../models/Subsidiary')

async function createSubsidiary (subsidiary) {
  return new Promise((resolve, reject) => {
    Subsidiary.create(subsidiary,
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

async function searchSubsidiary (name) {
  return new Promise((resolve, reject) => {
    Subsidiary.find({ nombre: name },
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
    ).lean()
  })
}

module.exports.create = async (event, context) => {
  const mongoconnection = context
  mongoconnection.callbackWaitsForEmptyEventLoop = false
  const Shape = JSON.parse(event.body)
  try {
    if (!Shape.nombre) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-011'
      }
    }
    if (!Shape.direccion) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-006'
      }
    }
    const checksubsidiary = await searchSubsidiary(Shape.nombre)
    if (checksubsidiary[0]) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-012'
      }
    }
    const response = await createSubsidiary(Shape)
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
