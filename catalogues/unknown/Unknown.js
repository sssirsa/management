const mongoose = require('mongoose');

const UnknownSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Unknown', UnknownSchema);