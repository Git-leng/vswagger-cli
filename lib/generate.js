// https://github.com/vuejs/vue-cli/blob/master/lib/generate.js

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var axios = require('axios');
var Metalsmith = require('metalsmith');

var logger = require('./logger')

var config;
var projectPath;
var templatePath;

var docName = 'docUrl';
var projectName = 'modelName'

function init (data, name, cb) {
  var helperPath = path.resolve(templatePath, '../helper/index.js')
  var helper = fs.existsSync(helperPath) ? require(helperPath) : {}

  var dest = path.join(config.output, name);

  var data = {
    data: data,
    config: config,
    _: _,
    $$: Object.assign({}, helper, {
      relative: function (targetFile) {
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

function build (data, source, dest, cb, ignore) {
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
    cb(error, f)
  })
}

function renderTemplateFiles (data) {
  return function (files) {
    Object.keys(files).forEach((fileName) => {
      var file = files[fileName]
      file.contents = _.template(file.contents, {
        interpolate: /\{\{(.+?)\}\}/g
      })(data)
    })
  }
}

function makeRequest(url, project) {
  return axios.get(url, {
    headers: { "Cookie" : '_swagger_token=' + (project.token || '') + ';_security_token=' + (project.token || '') }
  }).catch(error => {
     if (error.response) {
        logger.fatal(url + '          ' + error.response.status);
      } else {
        logger.fatal(error);
      }
  });
}

function getData(project, cb) {
  var arr = [];
  var parentUrlRequest = [];
  _.uniq(project[docName]).map(item => {
    parentUrlRequest.push(makeRequest(_.trim(item), project));
  });

  axios.all(parentUrlRequest).then(result => {
    var urlsRequest = [];
    result.map((itemRes, i) => {
      var itemRes = itemRes.data;

      if (itemRes.apis && itemRes.apis.length) {
        itemRes.apis.map(item => {
          urlsRequest.push(makeRequest(_.trim(project[docName][i]) + item.path, project));
        });
      }
    });

    axios.all(urlsRequest).then(res => {
      res.map(item => {
        item.data.apis.map(o => {
          arr.push({
            path: o.path,
            consumes: o.operations[0].consumes,
            deprecated: o.operations[0].deprecated,
            nickname: o.operations[0].nickname,
            notes: o.operations[0].notes,
            parameters: o.operations[0].parameters,
            produces: o.operations[0].produces,
            responseMessages: o.operations[0].responseMessages,
            type: o.operations[0].type,
            summary: o.operations[0].summary,
            method: o.operations[0].method
          });
        });
      });

      if (arr.length) {
        init(_.uniqBy(arr, 'path'), project[projectName], cb);
      }
    });
  });
}

module.exports = function (_projectPath, _templatePath, _config, cb) {
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
