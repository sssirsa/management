var ObjectId = require('mongoose').Types.ObjectId
var Subsidiary = require('../../models/Subsidiary')

async function updateSubsidiary (subsidiary, Subsidiaryid) {
  return new Promise((resolve, reject) => {
    Subsidiary.findByIdAndUpdate(Subsidiaryid, subsidiary, { new: true },
      (error, docs) => {
        if (error) {
          reject(new Error({
            statusCode: 500,
            body: JSON.stringify(error),
            headers: { 'Content-Type': 'application/json' }
          }))
        }
        resolve(docs)
      }).lean()
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

module.exports.update = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const ShapeId = event.pathParameters.id
  const Shape = JSON.parse(event.body)
  try {
    var ObjectValid = ObjectId.isValid(ShapeId)
    if (!ObjectValid) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-010'
      }
    }
    if (Shape.nombre) {
      const checksubsidiary = await searchSubsidiary(Shape.nombre)
      if (checksubsidiary[0]) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: 'MG-012'
        }
      }
    }
    const response = await updateSubsidiary(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-014'
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
