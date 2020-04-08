const mongoose = require('mongoose')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

const FridgeSchema = new mongoose.Schema({
  economico: String,
  id_unilever: String,
  no_serie: String,
  year: String,
  condicion: mongoose.Schema.Types.Mixed,
  estatus_unilever: mongoose.Schema.Types.Mixed,
  nuevo: Boolean,
  modelo: mongoose.Schema.Types.Mixed
})

module.exports = management.model('Fridge', FridgeSchema)
