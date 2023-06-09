const mongoose = require('mongoose');
const { User } = require("./User");

const UrlSchema = new mongoose.Schema({
    type: mongoose.Schema.Types.ObjectId,
    shortUrl:String, // unique
    originalUrl:String,
    expiredAt: Date,
    createdAt: Date,

})
// create Url model
const Url = mongoose.model("Url", UrlSchema);

module.exports = {Url};