const mongoose = require('mongoose')

const EntrySchema = new mongoose.Schema({
  cabinets: mongoose.Schema.Types.Mixed
})

module.exports = EntrySchema
