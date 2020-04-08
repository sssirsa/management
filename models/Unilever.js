const mongoose = require('mongoose')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

const UnileverSchema = new mongoose.Schema({
  code: String,
  description: String
})

module.exports = management.model('Unilever', UnileverSchema)
