const mongoose = require('mongoose')

const DepartureSchema = new mongoose.Schema({
  cabinets: mongoose.Schema.Types.Mixed
})

module.exports = DepartureSchema
