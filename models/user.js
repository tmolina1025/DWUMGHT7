const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  usuario: String,
  clave: String,
});

module.exports = mongoose.model('User', userSchema);