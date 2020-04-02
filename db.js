// db.js
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
let isConnected

// eslint-disable-next-line no-undef
module.exports = connectToDatabase = () => {
  if (isConnected) {
    console.log('=> using existing database connection')
    return Promise.resolve()
  }
  console.log('=> using new database connection')
  return mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(db => {
      isConnected = db.connections[0].readyState
    })
}
