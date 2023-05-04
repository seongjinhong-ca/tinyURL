const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    type: mongoose.Schema.Types.ObjectId,
    email:String, // unique
    password:String,// salt + hash
});

const User = mongoose.model("User", UserSchema);

module.exports = {User};