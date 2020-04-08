const mongoose = require('mongoose')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

const SubsidiarySchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  telefono: String,
  responsable: String
})

module.exports = management.model('Subsidiary', SubsidiarySchema)
