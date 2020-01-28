const mongoose = require('mongoose');

const FridgeBrandSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('FridgeBrand', FridgeBrandSchema);