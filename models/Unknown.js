const mongoose = require('mongoose')

const UnknownSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String
})

module.exports = mongoose.model('Unknown', UnknownSchema)
