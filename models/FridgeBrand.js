const mongoose = require('mongoose')

const FridgeBrandSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String
})

module.exports = FridgeBrandSchema
