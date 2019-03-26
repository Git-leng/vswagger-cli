var fs = require('fs');
var path = require('path');

// 获取到所有的文件内容和文件夹名称
function getFolders(filepath) {
    let folders = [];
    let files = fs.readdirSync(filepath);
    files.forEach(function(item) {
        let fPath = path.join(filepath, item);
        let stat = fs.statSync(fPath);
        // 忽略modules文件夹
        if (stat.isDirectory() === true && item !== 'modules') {
            const fileName = path.join(fPath, 'index.js');
            folders.push({
                name: item,
                content: fs.readFileSync(fileName, 'utf8')
            });
            // api下面所有文件夹删除
            delDir(fPath);
        }
    });
    return folders;
}

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
    // api下面，所有的文件夹解析出来
    var folders = getFolders(filePath);
    // 创建modules文件夹
    filePath = path.join(filePath, 'modules');
    delDir(filePath);
    fs.mkdirSync(filePath);
    // 在modules文件夹下创建对应文件，并写入指定内容
    for (let i = 0; i < folders.length; i++) {
        fs.writeFileSync(path.join(filePath, folders[i].name + '.js'), folders[i].content, 'utf8');
    }
}

exports.transform = transform;