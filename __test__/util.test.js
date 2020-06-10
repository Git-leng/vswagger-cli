/**
 * @file util.test.js
 * @desc 单元测试
 * @author leng_bw@163.com
 * @version 1.0.0
 * @date 2019-06-28
 */

var checkVersion = require('../lib/check-version.js');

// 版本检查
describe('工具 - 版本检查', () => {

  test('测试一下是否是最新版本', (done) => {
    callback = (data) => {
      expect(data).toBeUndefined();
      done();
    };

    checkVersion(callback);
  });
});
