var ObjectId = require('mongoose').Types.ObjectId
var Unilever = require('../../models/Unilever')
var Fridge = require('../../models/Fridge')

async function updateUnilever (unilever, Unileverid) {
  return new Promise((resolve, reject) => {
    Unilever.findByIdAndUpdate(Unileverid, unilever, { new: true },
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

async function updateUnileverInFridge (Newunilever, UnileverId) {
  return new Promise((resolve, reject) => {
    Fridge.update(
      { 'estatus_unilever._id': ObjectId(UnileverId) },
      {
        $set: {
          estatus_unilever: Newunilever
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

async function searchUnilever (value) {
  return new Promise((resolve, reject) => {
    Unilever.find({ code: value },
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
      const checkunilever = await searchUnilever(Shape.code)
      if (checkunilever[0]) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: 'MG-022'
        }
      }
    }
    const response = await updateUnilever(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-024'
      }
    } else {
      const update = await updateUnileverInFridge(response, ShapeId)
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
        body: 'MG-025'
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
