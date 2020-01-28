const mongoose = require('mongoose');

const FridgeModelSchema = new mongoose.Schema({
    nombre: String,
    marca: { type: mongoose.Schema.Types.ObjectId, ref: 'FridgeBrand' },
    tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipmentkind' },
    deleted: {type: Boolean, default: false}
});

const EquipmentkindSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    fijo: String,
    deleted: {type: Boolean, default: false}
});

const FridgeBrandSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    deleted: {type: Boolean, default: false}
});

const FridgeBrand = mongoose.model('FridgeBrand',FridgeBrandSchema);
const Equipmentkind = mongoose.model('Equipmentkind',EquipmentkindSchema);
module.exports = mongoose.model('FridgeModel', FridgeModelSchema);