let Author = require("./models/author")
let Poetry = require("./models/poetry")

let mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect("mongodb://127.0.0.1:27017/poetry");


let fs = require("fs")
let poetryPath = "./poetry"
let ciPath = "./ci"

let savePoetry = function (basePath) {
    let files = fs.readdirSync(basePath);
    let authorFiles = []
    let poetryFiles = []
    files.forEach(function (item) {
        if (item.indexOf("author") > -1) {
            authorFiles.push(item)
        } else if (item.indexOf("poet") > -1 || item.indexOf("ci") > -1) {
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
        fileContent.forEach(function (author, index) {
            if(basePath.indexOf("ci")<0){
                var author = new Author({
                    name: author.name,
                    desc: author.desc,
                    sort:'诗',
                    decade: authorFile.indexOf("tang") > -1 ? "tang" : "song"
                })
                authorPromise.push(author.save())
            }else{
                var author = new Author({
                    name: author.name,
                    desc: author.description,
                    short_desc:author.short_description,
                    sort:'词',
                    decade: authorFile.indexOf("tang") > -1 ? "tang" : "song"
                })
                authorPromise.push(author.save())
            }
        })
    })

    Promise.all(authorPromise).then(function () {
        console.log("作者数据库保存完毕")
        let poetryLen = poetryFiles.length
        let index = 0;
        function readFileToMongo() {
            let poetryPromise = []
            var poetryFile = poetryFiles[index]
            const filePath = basePath + "/" + poetryFile
            let fileContent = fs.readFileSync(filePath)
            fileContent = JSON.parse(fileContent)
            fileContent.forEach(async function (poetryContent, index) {
                if(poetryContent.rhythmic){
                    poetryContent.title = poetryContent.rhythmic
                    delete poetryContent.rhythmic
                }
                let poetry = new Poetry(poetryContent)
                poetry.decade = poetryFile.indexOf("tang") > -1 ? "tang" : "song"
                poetry.sort = basePath.indexOf('ci')>-1?'词':'诗'
                poetryPromise.push(poetry.save())
            })
            Promise.all(poetryPromise).then(function () {
                console.log("第" + index + "个文件保存完毕")
                index++
                if (index < poetryLen) {
                    readFileToMongo()
                } else {
                    console.log(basePath+"执行完毕，ctrl+c退出")
                }
            })
        }
        readFileToMongo()
    })
}
savePoetry(poetryPath)
savePoetry(ciPath)