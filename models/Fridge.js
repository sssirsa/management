const mongoose = require('mongoose')

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

module.exports = mongoose.model('Fridge', FridgeSchema)
