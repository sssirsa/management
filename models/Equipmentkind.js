const mongoose = require('mongoose');

const EquipmentKindSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
});

module.exports = mongoose.model('EquipmentKind', EquipmentKindSchema);