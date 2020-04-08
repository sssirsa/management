var ObjectId = require('mongoose').Types.ObjectId
var Condition = require('../../models/Condition')
var Fridge = require('../../models/Fridge')

async function updateCondition (condition, Conditionid) {
  return new Promise((resolve, reject) => {
    Condition.findByIdAndUpdate(Conditionid, condition, { new: true },
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

async function updateConditionInFridge (Newcondition, ConditionId) {
  return new Promise((resolve, reject) => {
    Fridge.update(
      { 'condicion._id': ObjectId(ConditionId) },
      {
        $set: {
          condicion: Newcondition
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

async function searchCondition (value) {
  return new Promise((resolve, reject) => {
    Condition.find({ letra: value },
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
    if (Shape.letra) {
      const checkcondition = await searchCondition(Shape.letra)
      if (checkcondition[0]) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: 'MG-016'
        }
      }
    }
    const response = await updateCondition(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-018'
      }
    } else {
      const update = await updateConditionInFridge(response, ShapeId)
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
        body: 'MG-019'
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
