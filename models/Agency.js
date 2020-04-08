const mongoose = require('mongoose')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

const AgencySchema = new mongoose.Schema({
  agencia: String,
  centro: String,
  direccion: String,
  telefono: String,
  zona: String
})

module.exports = management.model('Agency', AgencySchema)
