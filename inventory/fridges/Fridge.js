const mongoose = require('mongoose');

const FridgeSchema = new mongoose.Schema({
    economico: String,
    id_unilever: String,
    no_serie: String,
    year: String,
    nuevo: { type: Boolean, default: true },
    modelo: {
        deleted: {type: Boolean, default: false},
        nombre: String,
        marca: {
            
        },
        tipo: {

        }
    }
});

module.exports = mongoose.model('Fridge', FridgeSchema)