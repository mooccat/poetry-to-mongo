let Author = require("./models/author")
let Poetry = require("./models/poetry")

let mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect("mongodb://127.0.0.1:27017/poetry");


let fs = require("fs")

let basePath = "./poetry"

let files = fs.readdirSync(basePath);
let authorFiles = []
let poetryFiles = []
files.forEach(function (item) {
    if (item.indexOf("authors") > -1) {
        authorFiles.push(item)
    } else if (item.indexOf("poet") > -1) {
        poetryFiles.push(item)
    }
})
let authorFilesLength = 0
let currentAuthorIndex = 0

let authorPromise = []

authorFiles.forEach(function (authorFile) {
    authorFilesLength += authorFile.length
    const filePath = basePath + "/" + authorFile
    let fileContent = fs.readFileSync(filePath)
    fileContent = JSON.parse(fileContent)
    fileContent.forEach(function(author,index){
       var author = new Author({
           name:author.name,
           desc:author.desc,
           sort:authorFile.indexOf("tang") > -1? "tang":"song"
       })
       authorPromise.push(author.save())
    })
})

Promise.all(authorPromise).then(function(){
    console.log("作者数据库保存完毕")
    let poetryLen = poetryFiles.length
    let index = 0;
    function readFileToMongo(){
        let poetryPromise = []
        var poetryFile = poetryFiles[index]
        const filePath = basePath + "/" + poetryFile
        let fileContent = fs.readFileSync(filePath)
        fileContent = JSON.parse(fileContent)
        fileContent.forEach(async function(poetryContent,index){
            let poetry = new Poetry(poetryContent)
            poetry.sort = poetryFile.indexOf("tang") > -1? "tang":"song"
            poetryPromise.push(poetry.save())
        })
        Promise.all(poetryPromise).then(function(){
            console.log("第"+index+"首诗保存完毕")
            index++
            if(index<poetryLen){
                readFileToMongo()
            }else{
                console.log("执行完毕，ctrl+c退出")
            }
        })
    }
    readFileToMongo()
})
   
