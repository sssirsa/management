const mongoose = require('mongoose');

const UnknownStatusSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    accion: String,
    deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('UnknownStatus', UnknownStatusSchema);