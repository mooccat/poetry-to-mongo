let mongoose = require('mongoose');

let Schema = mongoose.Schema

let AuthorCiSchema = new Schema({
    "name":{type:String},
    "desc":String,
    "short_desc":String,
    "decade":String
})

module.exports = mongoose.model("AuthorCi",AuthorCiSchema)