const mongoose = require('mongoose')

const FrigeModelSchema = new mongoose.Schema({
  nombre: String,
  marca: mongoose.Schema.Types.Mixed,
  tipo: mongoose.Schema.Types.Mixed
})

module.exports = FrigeModelSchema
