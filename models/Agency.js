const mongoose = require('mongoose')

const AgencySchema = new mongoose.Schema({
  agencia: String,
  centro: String,
  direccion: String,
  telefono: String,
  zona: String
})

module.exports = AgencySchema
