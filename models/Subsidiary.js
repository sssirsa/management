const mongoose = require('mongoose')

const SubsidiarySchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  telefono: String,
  responsable: String
})

module.exports = mongoose.model('Subsidiary', SubsidiarySchema)
