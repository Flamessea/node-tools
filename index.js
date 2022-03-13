const path = require("path")
const fs = require("fs")

const options = {
    flags: 'w',
    encoding: 'utf8'
}
const stderr = fs.createWriteStream('./message/data.txt', options);
const logger = new console.Console(stderr);

// 自己文件所在绝对位置
const pathName = "D:\\project\\chat-tool\\assets"

// 读取文件夹所有文件
const readdir = (callback = () => void 0) => {
    fs.readdir(pathName, function(err, files){
        let dirs = [];
        (function iterator(i){
            if(i === files.length) {
                callback(dirs)
                return
            }
            fs.stat(path.join(pathName, files[i]), function(err, data){
                if(data.isFile()){
                    dirs.push(files[i])
                }
                iterator(i+1)
            })
        })(0)
    })
}

// 读取html文件内容
const readFile = url => {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, file) => {
            if(err){
                return reject()
            }
            const data = file.match(/<div class="text">([\s\S]*?)<\/div>/g)
            return resolve(data)
        })
    })
}

// 写入到所要内容到本地
console.log('----------------------- 读取开始，请稍等... ------------------------')
readdir(async dirs => {
    if(dirs.length <= 0){
        console.log('---------------------- 读取错误 ---------------------')
        return console.error('请把html文件放入到assets文件中!')
    }
    for (let i = 0; i < dirs.length; i++) {
        const data = await readFile(`./assets/${dirs[i]}`)
        logger.log(`-------------------------------------------------  ${dirs[i]}  -----------------------------------------------`)
        for (let j = 0; j < data.length; j++) {
            const textItem = data[j].replace('<div class="text">', '').replace('</div>', '').replace(/\s*/g,'')
            logger.log(textItem)
        }
    }
    console.log('------------------------ 读取结束，请在/message/文件夹查看结果 -------------------------')
})
