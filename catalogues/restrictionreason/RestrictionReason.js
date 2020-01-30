const mongoose = require('mongoose');

const RestrictionReasonSchema = new mongoose.Schema({
    description: String,
    deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('RestrictionReason', RestrictionReasonSchema);