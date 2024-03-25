# hx-configuration-helper

> 一种更舒适的hx插件配置方法~

>
> hx插件获取配置太繁琐？配置排序和命名两难择？
>
> 没问题！本组件将统统解决这些问题！

## 使用

> 本组件分两部分构成： [cli](#cli部分) 和 [cjs函数](#cjs函数部分)
> 
> 组件应用实例：[hx-copy-to](https://github.com/noah227/hx-copy-to)

### cli部分

> cli用来根据插件项目根目录下的package.json生成配置key的映射文件
>
> 主要是为了方便代码自动推断和提示

建议添加在package.json里，方便运行

```json
{
    "scripts": {
        "cfg:build": "hx-cfg-helper"
    }
}
```

运行后，插件根目录下会生成`config.helper.js`文件

> **注意事项：cli部分识别形如`hx-my-plugin.a_configName`的key，在使用时请确保下划线后的部分不要重复**

### cjs函数部分

```js
const {Helper} = require("hx-configuration-helper")

// 初始化，传入根路径（如果当前js不在根路径，则使用path处理后得到的路径）
const h = new Helper(__dirname)
// cli生成的内容
const keyMap = require("./config.helper.js")
// 获取配置项（这里配合生成的`config.helper.js`能获得友好的代码提示）
h.getItem(keyMap.keepUserSelection)
// 更新配置项
h.updateItem(keyMap.keepUserSelection, true)
```

### 小技巧

参见 [小技巧](./skill.md) 


