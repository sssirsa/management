const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema({
    description: String,
    letra: String,
});

module.exports = mongoose.model('Condition', ConditionSchema);