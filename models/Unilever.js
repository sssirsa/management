const mongoose = require('mongoose')

const UnileverSchema = new mongoose.Schema({
  code: String,
  description: String
})

module.exports = mongoose.model('Unilever', UnileverSchema)
