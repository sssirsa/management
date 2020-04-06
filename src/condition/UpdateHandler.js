const mongoose = require('mongoose')
const ConditionSchema = require('../../models/Condition')
const FridgeSchema = require('../../models/Fridge')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
var Condition = management.model('Condition', ConditionSchema)
var Fridge = management.model('Fridge', FridgeSchema)

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
      { 'condicion._id': mongoose.Types.ObjectId(ConditionId) },
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
    const response = await updateCondition(Shape, ShapeId)
    if (!response || response.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: 'No se encontro condicion con el id especificado'
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
        body: 'Se han actualizado la colección de condicion pero no de cabinet'
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
