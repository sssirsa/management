const mongoose = require('mongoose');

const UnknownStatusSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    accion: String,
});

module.exports = mongoose.model('UnknownStatus', UnknownStatusSchema);