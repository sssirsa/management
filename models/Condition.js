const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema({
    descripcion: String,
    letra: String,
});

module.exports = mongoose.model('Condition', ConditionSchema);