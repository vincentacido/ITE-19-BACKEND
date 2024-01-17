const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String },
  password: { type: String },
});

const USER = mongoose.model("USER", UserSchema);

module.exports = USER;
