const mongoose = require('mongoose');

const RestrictionReasonSchema = new mongoose.Schema({
    description: String,
});

module.exports = mongoose.model('RestrictionReason', RestrictionReasonSchema);