const mongoose = require('mongoose');

const FridgeSchema = new mongoose.Schema({
    economico: String,
    id_unilever: String,
    no_serie: String,
    year: String,
    condicion: { type: mongoose.Schema.Types.ObjectId, ref: 'Condition' },
    estatus_unilever: { type: mongoose.Schema.Types.ObjectId, ref: 'Unilever' },
    modelo: { type: mongoose.Schema.Types.ObjectId, ref: 'FridgeModel' },
    nuevo: { type: Boolean, default: true }
});

const FridgeModelSchema = new mongoose.Schema({
    nombre: String,
    marca: { type: mongoose.Schema.Types.ObjectId, ref: 'FridgeBrand' },
    tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipmentkind' },
    deleted: { type: Boolean, default: false }
});

const EquipmentkindSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    fijo: String,
    deleted: { type: Boolean, default: false }
});

const FridgeBrandSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    deleted: { type: Boolean, default: false }
});

const ConditionSchema = new mongoose.Schema({
    descripcion: String,
    letra: String,
});

const UnileverSchema = new mongoose.Schema({
    code: String,
    description: String,
});

const Condition = mongoose.model('Condition', ConditionSchema);
const Unilever = mongoose.model('Unilever', UnileverSchema);
const FridgeBrand = mongoose.model('FridgeBrand', FridgeBrandSchema);
const Equipmentkind = mongoose.model('Equipmentkind', EquipmentkindSchema);
const Model = mongoose.model('FridgeModel', FridgeModelSchema);
module.exports = mongoose.model('Fridge', FridgeSchema)