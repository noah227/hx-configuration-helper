const fs = require("fs");
const path = require("path");


/**
 * 处理形如a_xxx的key
 * @param {string} key
 */
const processKey = key => {
    if (key.indexOf("_") < 0) return key
    return key.slice(key.indexOf("_") + 1)
}

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
            const cfgHelperPath = path.join(cwd, "helper.json")
            const cfgHelperSchemaPath = path.join(cwd, "helper.schema.json")
            // let _data = {}
            // // 如果存在生成的文件，则读取进行继承
            // if(fs.existsSync(cfgHelperPath)) {
            //     _data = JSON.parse(fs.readFileSync(cfgHelperPath, {encoding: "utf8"}))
            // }

            const properties = configuration.properties || []
            const {keyMap, schemaMap} = Object.keys(properties).reduce(({keyMap, schemaMap}, k) => {
                const kPart = k.split(".")[1]
                const _k = processKey(kPart)
                keyMap[_k] = kPart

                schemaMap[_k] = {}
                const {description} = properties[k]
                if (description) schemaMap[_k]["description"] = description

                return {keyMap, schemaMap}
            }, {
                keyMap: {"$schema": "helper.schema.json"},
                schemaMap: {}
            })
            fs.writeFileSync(
                cfgHelperPath,
                JSON.stringify(keyMap, null, 4)
            )
            fs.writeFileSync(
                cfgHelperSchemaPath,
                JSON.stringify({
                    properties: schemaMap
                }, null, 4)
            )
            console.log("已生成文件：", cfgHelperPath, cfgHelperSchemaPath)
        }
    }
}
