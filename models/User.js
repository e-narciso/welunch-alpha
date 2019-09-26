const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  isAdmin: { type: Boolean },
  profileImage: { type: String },
  googleID: { type: String }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
