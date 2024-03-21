## 更舒适的排序

应用本组件，可以对插件的配置进行更好的排序。

比方说现在有个配置序列是这样
```json
{
    "configuration": {
        "title": "文件复制",
        "properties": {
            "myname-hx-my-plugin.remindMeNextTime": {
                "type": "boolean"
            },
            "myname-hx-my-plugin.keepMySelection": {
                "type": "boolean"
            } 
        }
    }
}
```

我们本意是这里怎么写，配置页面怎么显示。

但是目前来说，HBuilderX的每个插件内的配置项是按照`configuration.properties`里的键进行排序的。

如果想让配置项和写的顺序一样，要么调换这里面写的顺序，要么修改配置项的键，比如加前缀什么的。

```json
{
    "myname-hx-my-plugin.a_remindMeNextTime": {
        "type": "boolean"
    },
    "myname-hx-my-plugin.b_keepMySelection": {
        "type": "boolean"
    }
}
```

