# vswagger [![npm package](https://img.shields.io/npm/v/vue-cli.svg)](https://www.npmjs.com/package/vswagger-cli)
vswagger是一个基于 swagger 快速生成 API 调用文件的命令行工具, 主要功能将接口同步到本地文件

* ### Installation
> Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.x, 8.x preferred), npm version 3+ and [Git](https://git-scm.com/).
>
> ``` bash
> $ npm install -g vswagger-cli
> ```

* ### Usage

> ``` bash
> $ vswagger init
> ```
>
> Example:
>
> ``` bash
> $ vswagger init
> ```

* ### 使用方法(步骤)：
> 1. 全局安装vswagger
> ```bash
> npm install -g vswagger-cli
> ```
>
> 2. 添加根目录配置文件 `.vswagger.js`
>
>
> ```javascript
> /**
>  * .vswagger 配置文件
>  */
>
> module.exports = {
>     template: '', // 可为空使用默认接口生成模板
>     generateType: 'souche', // 默认不要写
>     safe: true, // 是否生成保护数据
>     output: "src/api", // 输出到api目录
>     projectDir: "src", // 代码存放目录(可不配置默认为src路径)
>     suffix: [".js",".vue"], // 指定查询的文件(可不配置，默认.js,.vue文件)
>     projects: [{
>         version: '2.x', 
>         domain: 'TEST', // 环境变量
>         token: '值', // swagger令牌
>         modelName: "demo1", // 模块化名称
>         docUrl: ['api-docs', 'api-docs', 'api-docs', 'api-docs']  // swagger base-url
>     }, {
>         version: '1.x', 
>         domain: 'TEST', // 环境变量
>         token: '值', // swagger令牌
>         modelName: 'demo2',
>         docUrl: ['api-docs'] // 多个
>     }] // 项目配置
> };
> ```


> 3. 生成接口
> ```
> vswagger init
> ```

> 4. 只更新/生成某个模块的接口
> ```
> vswagger init 项目目录(.vswagger.js目录) 模块名称(a模块,b模块,c模块)
> vswagger init ./ a
> ```

> 5. 项目结束后开始清理无用的接口
> ```
> vswagger clean
> ```

> 6. 增加接口保护功能
> ```
> 通过safe开启
> ```

> 7. 新增接口检测功能
> ```
> vswagger check
> ```

> 8.支持2.x版本数据结构解析处理

## 直接上图看效果
>
> ### 生成的目录
>
>>  `index.js` 文件是接口存放文件
>>  `instance.js` 文件是配置 **开发/预发/线上** 接口访问的域名
>>  `util.js` 文件是工具方法
>
>![ 模块化结构](http://img.souche.com/f2e/0bff8842e501170d9438c808d0b1ca31.jpg)
>
> ### 生成接口结构
>
>![ 接口结构](http://img.souche.com/f2e/f992480ebdbe4e9b658dfa23789fcf75.jpg)
>
> ### 配置接口访问的域名
>
> ![调用接口](http://img.souche.com/f2e/e6f71d290ad74e49d16044747cb178f5.jpg)
>
> ### 打包时会检查接口是否有遗漏（如果有遗漏会给出提示）
>
>![ 清理接口接口遗漏](http://img.souche.com/f2e/534d2efa951f3342a200ac89cd9de3c2.jpg)

