let mongoose = require('mongoose');

let Schema = mongoose.Schema

let AuthorSchema = new Schema({
    "name":{type:String},
    "desc":String,
    "sort":String,
    "short_desc":String,
    "decade":String
})

module.exports = mongoose.model("Author",AuthorSchema)