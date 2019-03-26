var fs = require('fs');
var path = require('path');

function delDir(filePath) {
    let files = [];
    if (fs.existsSync(filePath)) {
        files = fs.readdirSync(filePath);
        files.forEach((file, index) => {
            let curPath = filePath + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(filePath);
    }
}

function transform(filePath) {
    // 将生成出来的文件，转译成对应的文件即可
    // 获取文件夹名称
    var fileName = filePath.split('/');
    fileName = fileName[fileName.length - 1];
    // 获取文件内容
    var fileContent = fs.readFileSync(path.join(filePath, 'index.js'), 'utf8');
    // 删除文件
    delDir(filePath);
    // 判断是否有modulesName 文件夹
    var modulesFilePath = path.join(filePath, '../modules');
    if (!fs.existsSync(modulesFilePath)) {
        fs.mkdirSync(modulesFilePath);
    }
    // 判断是否存在对应的js文件
    var modulesDestJSFilePath = path.join(modulesFilePath, fileName + '.js');
    fs.writeFileSync(modulesDestJSFilePath, fileContent, 'utf8');
}

exports.transform = transform;