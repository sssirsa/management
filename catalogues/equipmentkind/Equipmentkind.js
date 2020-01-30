const mongoose = require('mongoose');

const EquipmentkindSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Equipmentkind', EquipmentkindSchema);