const mongoose = require('mongoose')

const ChangeSchema = new mongoose.Schema({
  cabinets: mongoose.Schema.Types.Mixed
})

module.exports = ChangeSchema
