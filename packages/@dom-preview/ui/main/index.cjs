const path = require("node:path")


module.exports = {
    getUiRootFolder() {
        return path.join(__dirname, "..", "dist")
    }
}