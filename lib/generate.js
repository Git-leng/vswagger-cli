// https://github.com/vuejs/vue-cli/blob/master/lib/generate.js

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var axios = require('axios');
var Metalsmith = require('metalsmith');

var logger = require('./logger')
var Utils = require('./utils');

var config;
var projectPath;
var templatePath;

var docName = 'docUrl';
var projectName = 'modelName'

function init(data, project, cb) {
    var helperPath = path.resolve(templatePath, '../helper/index.js')
    var helper = fs.existsSync(helperPath) ? require(helperPath) : {}

    var dest = path.join(config.output, project[projectName]);
    // 使用vue环境变量的名称
    const moduleName = project[projectName].toUpperCase()

    var data = {
        data: { list: data, project: project, moduleName },
        config: config,
        _: _,
        $$: Object.assign({}, helper, {
            relative: function(targetFile) {
                var relative = path.relative(dest, config.output)
                return path.posix.join(relative, targetFile)
            }
        })
    }

    build(data, 'cover', dest, cb)
    if (fs.existsSync(path.join(templatePath, 'init'))) build(data, 'init', dest, cb, true)

    if (fs.existsSync(path.join(templatePath, 'common'))) {
        build({
            config: config,
            _: _,
            $$: helper
        }, 'common', config.output, cb, true)
    }
}

function build(data, source, dest, cb, ignore) {
    var metalsmith = Metalsmith(templatePath)
        .use(renderTemplateFiles(data))
        .clean(false)
        .source(source)
        .destination(dest)

    if (ignore) {
        metalsmith.ignore(filePath => {
            filePath = filePath.replace(path.join(templatePath, source), '')
            filePath = path.join(dest, filePath)
            return fs.existsSync(filePath)
        })
    }

    return metalsmith.build((error, files) => {
        if (error) logger.fatal(error)
        var f = Object.keys(files)
            .filter(o => fs.existsSync(path.join(dest, o)))
            .map(o => path.join(dest, o))

        // 搜车模板，临时可用
        if (config.generateType === 'souche' && source === 'cover') {
            // 将生成出来的文件，转译成对应的文件即可
            Utils.transform(dest);
        } else {
            cb(error, f)
        }

    })
}

function renderTemplateFiles(data) {
    return function(files) {
        Object.keys(files).forEach((fileName) => {
            var file = files[fileName]
            file.contents = _.unescape(_.template(file.contents, {
                interpolate: /\{\{(.+?)\}\}/g
            })(data))
        })
    }
}

function makeRequest(url, project) {
    var token = project.token || '';
    return axios.get(_.trim(url), {
        headers: { "Cookie": '_swagger_token=' + token + ';_security_token=' + token }
    }).catch(error => {
        if (error.response) {
            logger.fatal(url + '          ' + error.response.status);
        } else {
            logger.fatal(error);
        }
    });
}

function parseRes(data, props) {
    let baseType = config.baseType;
    let e = {};
    Object.keys(data).map(item => {
        let type = data[item].type;
        if (Object.keys(baseType).indexOf(type) === -1) {
            e[item] = parseRes(props.models[type] ? props.models[type].properties : [], props);
        } else {
            e[item] = baseType[type];
        }
    });
    return e;
}

function getData(project, cb) {
    var arr = [];
    var parentUrlRequest = [];
    _.uniq(project[docName]).map(item => {
        parentUrlRequest.push(makeRequest(`${item}?group=souche&_t=${new Date().getTime()}`, project));
    });

    axios.all(parentUrlRequest).then(result => {
        let path = result[0].request.path;
        let code = result[0].data.code || '';
        if (path.indexOf('login') !== -1 || code == 10001) {
            logger.log('更新失败   ', `${project[projectName]}模块，token已失效!`);
        }
        var urlsRequest = [];
        result.map((itemRes, i) => {
            var itemRes = itemRes.data;

            if (itemRes.apis && itemRes.apis.length) {
                itemRes.apis.map(item => {
                    urlsRequest.push(makeRequest(project[docName][i] + item.path, project));
                });
            }
        });

        axios.all(urlsRequest).then(res => {
            res.map(item => {
                item.data.apis.map(o => {
                    let baseType = config.baseType;
                    // let type = o.operations[0].responseMessages[0].responseModel;
                    let type = o.operations[0].type;
                    let res = baseType[type] || '';
                    if (config.safe) {
                        if (item.data.models && type && item.data.models[type]) {
                            res = item.data.models[type] || {};
                            res = parseRes(res ? res.properties : {}, item.data);
                        }
                    }

                    o.operations[0].responseMessages[0].responseModel = JSON.stringify(res);
                    arr.push({
                        path: o.path,
                        ...o.operations[0]
                    });
                });
            });

            if (arr.length) {
                init(_.uniqBy(arr, 'path'), project, cb);
            }
        });
    });
}

module.exports = function(_projectPath, _templatePath, _config, cb) {
    config = _config;
    projectPath = _projectPath;

    templatePath = path.join(_templatePath, 'template');
    config.output = path.resolve(projectPath, config.output || 'vswagger-api');

    if (_.isEmpty(config.projects)) return;
    if (!_.isArray(config.projects)) logger.fatal('请正确配置项目列表.');

    var projects = config.projects
        .filter(o => _.has(o, docName) && _.has(o, projectName) && !_.isEmpty(o[docName]))
        .map(project => getData(project, cb));

    if (projects.length !== config.projects.length) logger.fatal('projects,缺少字段，请正确配置项目列表.');
}