#!/usr/bin/env node

const {Command} = require("commander")
const program = new Command()

// 注册版本及描述信息
program
    .name("hx-cfg-helper")
    .description("hx插件开发配置助手")
    .version(`${require("../package.json").version}`)

// 注册支持的命令及执行函数
program
    .action((options) => {
        require("./core")(options)
    })

// 执行参数处理
program.parse()
