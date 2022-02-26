const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   username: {type: String},
   firstname: {type: String}, // required: true
   lastname: {type: String},
   email: {type: String},
   password: {type: String},
   recordDate: {type: Date, default: Date.now}
})

module.exports = mongoose.model('user', userSchema)