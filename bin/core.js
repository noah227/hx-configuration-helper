const fs = require("fs");
const path = require("path");


/**
 * 处理形如a_xxx的key为xxx
 * @param {string} key
 */
const processKey = key => {
    if (key.indexOf("_") < 0) return key
    return key.slice(key.lastIndexOf("_") + 1)
}

const tpl = `/** 由${require("../package.json").name}生成 | @date */
module.exports = {
@content
}
`
module.exports = (options) => {
    const cwd = process.cwd()
    const pkgPath = path.join(cwd, "package.json")
    if (fs.existsSync(pkgPath)) {
        /**
         * @type {{
         *     version: string,
         *     contributes?: {
         *         commands?: any[],
         *         menus?: any[],
         *         configuration?: {
         *             title?: string,
         *             properties?: {
         *                 [index: string]: {
         *                     type?: string,
         *                     default?: string,
         *                     description?: string
         *                 }
         *             }
         *         }
         *     }
         * }}
         */
        const pkg = require(pkgPath)

        const configuration = pkg.contributes?.configuration
        if (configuration) {
            const cfgHelperPath = path.join(cwd, "config.helper.js")

            const properties = configuration.properties || []
            const {keyMap, schemaMap} = Object.keys(properties).reduce(({keyMap, schemaMap}, k) => {
                const kPart = k.split(".")[1]
                const _k = processKey(kPart)
                keyMap[_k] = kPart

                schemaMap[_k] = {...properties[k]}

                return {keyMap, schemaMap}
            }, {
                keyMap: {},
                schemaMap: {}
            })
            // 备注行&字段行
            let lineGroup = []
            Object.entries(keyMap).forEach(([k, v], index) => {
                const {description, type, default: defaultValue} = {...schemaMap[k]}
                let comment = ""
                if (description) comment = description
                if (type) comment += ` | @return {${type}}`
                if (defaultValue) comment += ` @default ${defaultValue}`
                if (comment) lineGroup.push(`\t/** ${comment} */`)
                lineGroup.push(`\t${k}: "${v}",`)
            })
            fs.writeFileSync(
                cfgHelperPath,
                tpl.replace("@date", new Date().toLocaleString())
                    .replace("@content", lineGroup.join("\n"))
            )
            console.log("已生成文件：", cfgHelperPath)
        }
    }
}
