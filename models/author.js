let mongoose = require('mongoose');

let Schema = mongoose.Schema

let AuthorSchema = new Schema({
    "name":{type:String},
    "desc":String,
    "sort":String
})

module.exports = mongoose.model("Author",AuthorSchema)