var Sssirsa = require('../../models/Sssirsa')

async function createSssirsa (sssirsa) {
  return new Promise((resolve, reject) => {
    Sssirsa.create(sssirsa,
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
    const checksssirsa = await searchSssirsa(Shape.code)
    if (checksssirsa[0]) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: 'MG-026'
      }
    }
    const response = await createSssirsa(Shape)
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
