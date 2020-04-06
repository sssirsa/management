const mongoose = require('mongoose')

const FrigeModelSchema = new mongoose.Schema({
  nombre: String,
  marca: { type: mongoose.Schema.Types.ObjectId, ref: 'FridgeBrand' },
  tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentKind' }
})

module.exports = FrigeModelSchema
