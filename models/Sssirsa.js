const mongoose = require('mongoose')

const SssirsaSchema = new mongoose.Schema({
  code: String,
  description: String
})

module.exports = SssirsaSchema
