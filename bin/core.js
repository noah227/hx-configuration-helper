const fs = require("fs");
const path = require("path");

const tpl = `
module.exports = @content
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
            const properties = configuration.properties || []
            const keyMap = Object.keys(properties).reduce((keyMap, k) => {
                k = k.split(".")[1]
                keyMap[k] = k
                return keyMap
            }, {})
            const cfgHelperPath = path.join(cwd, "config.helper.js")
            fs.writeFileSync(
                cfgHelperPath,
                tpl.replace("@content", JSON.stringify(keyMap, null, 4))
            )
            console.log(">>>", cfgHelperPath)
        }
    }
}
