const mongoose = require('mongoose');

const SssirsaSchema = new mongoose.Schema({
    code: String,
    description: String,
});

module.exports = mongoose.model('Sssirsa',SssirsaSchema);