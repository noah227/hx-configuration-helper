const hx = require("hbuilderx")
const path = require("path")
const fs = require("fs");

const Helper = class {
    /**
     * @param {string} pluginRoot 插件路径，如果调用文件在根目录，则传入__dirname即可
     */
    constructor(pluginRoot) {
        this.cwd = pluginRoot
        this.pkg = this.initPkg()
        this.err = null
    }

    initPkg() {
        const pkgPath = path.join(this.cwd, "package.json")
        if (fs.existsSync(pkgPath)) {
            return require(pkgPath)
        } else {
            this.err = `${pkgPath} 不存在`
            console.error(this.err)
            throw new Error(this.err)
        }
    }

    getConfiguration() {
        if (!this.pkg) throw new Error(this.err)
        else if (!this.pkg.id) throw new Error("package.json不存在id字段！")
        else {
            return hx.workspace.getConfiguration(this.pkg.id)
        }
    }

    getItem(section, defaultValue) {
        return this.getConfiguration().get(section, defaultValue)
    }

    /**
     * @param {string} section
     * @param {string | number | boolean} value
     */
    updateItem(section, value) {
        this.getConfiguration().update(section, value)
    }
}

module.exports = {
    Helper
}
