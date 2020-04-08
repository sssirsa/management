var ObjectId = require('mongoose').Types.ObjectId
var Sssirsa = require('../../models/Sssirsa')
var Fridge = require('../../models/Fridge')

async function updateSssirsa (sssirsa, SssirsaId) {
  return new Promise((resolve, reject) => {
    Sssirsa.findByIdAndUpdate(SssirsaId, sssirsa, { new: true },
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

async function updateSssirsaInFridge (Newsssirsa, SssirsaId) {
  return new Promise((resolve, reject) => {
    Fridge.update(
      { 'estatus_sssirsa._id': ObjectId(SssirsaId) },
      {
        $set: {
          estatus_sssirsa: Newsssirsa
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

async function searchSssirsa (value) {
  return new Promise((resolve, reject) => {
    Sssirsa.find({ code: value },
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
    if (Shape.code) {
      const checkunilever = await searchSssirsa(Shape.code)
      if (checkunilever[0]) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: 'MG-026'
        }
      }
    }
    const response = await updateSssirsa(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-028'
      }
    } else {
      const update = await updateSssirsaInFridge(response, ShapeId)
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
        body: 'MG-029'
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
