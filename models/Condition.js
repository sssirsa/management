const mongoose = require('mongoose')
var management = mongoose.createConnection(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

const ConditionSchema = new mongoose.Schema({
  descripcion: String,
  letra: String
})

module.exports = management.model('Condition', ConditionSchema)
