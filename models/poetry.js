let mongoose = require('mongoose');

let Schema = mongoose.Schema

let PoetrySchema = new Schema({
    "strains": [],
    "author": String,
    "sort":String,
    "paragraphs": [],
    "title": String
})

module.exports = mongoose.model("Poetry", PoetrySchema)