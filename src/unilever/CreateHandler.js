var Unilever = require('../../models/Unilever')

async function createUnilever (unilever) {
  return new Promise((resolve, reject) => {
    Unilever.create(unilever,
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

module.exports.create = async (event, context) => {
  const mongoconection = context
  mongoconection.callbackWaitsForEmptyEventLoop = false
  const Shape = JSON.parse(event.body)
  try {
    if (!Shape.code) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-020'
      }
    }
    if (!Shape.description) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-021'
      }
    }
    const checkunilever = await searchUnilever(Shape.code)
    if (checkunilever[0]) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-022'
      }
    }
    const response = await createUnilever(Shape)
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
