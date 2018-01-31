# vswagger [![npm package](https://img.shields.io/npm/v/vue-cli.svg)](https://www.npmjs.com/package/vswagger-cli)
---

自动生成模块化api接口文件，方便调用，接口管理，与服务端接口对接

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
> 2. 添加根目录配置文件 .vswagger.js
> ```javascript
> /**
>  * .vswagger 配置文件
>  */
>
> module.exports = {
>     template: '', // 可为空使用默认接口生成模板
>     output: "src/api", // 输出api目录
>     projectDir: "src", // 检查调用过的接口代码(可不配置默认为src路径)
>     suffix: [".js",".vue"], // 指定查询的文件(可不配置，默认.js,.vue文件)
>     projects: [{
>         token: '值', // swagger令牌
>         modelName: "demo1", //模块化名称
>         docUrl: ['api-docs', 'api-docs', 'api-docs', 'api-docs']  // swagger base-url
>     }, {
>         token: '值', // swagger令牌
>         modelName: 'demo2', // 多个
>         docUrl: ['api-docs']
>     }] // 项目配置
> };
> ```


> 3. 生成接口
> ```
> vswagger init
> ```

> 3. 项目结束后开始清理无用的接口
> ```
> vswagger clean
> ```
---

## 直接上图看效果
>
>> 生成的目录
>
>![模块化结构](https://sfault-image.b0.upaiyun.com/127/639/127639242-5a712cbb821e9_articlex)
>
>> 生成接口结构
>
>![接口结构](https://sfault-image.b0.upaiyun.com/841/758/841758257-5a712ead160f2_articlex)
>
>> 使用接口
>
>![调用接口](https://sfault-image.b0.upaiyun.com/315/393/3153930385-5a71310b6567d_articlex)
>
>> 打包时会检查接口是否有遗漏（如果有遗漏会给出提示）
>
>![清理接口接口遗漏](https://sfault-image.b0.upaiyun.com/429/204/4292043823-5a7132688f6f1_articlex)




