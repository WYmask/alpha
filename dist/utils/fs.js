"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExists = fileExists;
exports.removeDirectoryContents = removeDirectoryContents;
const promises_1 = require("fs/promises");
async function fileExists(crxFilePath) {
    try {
        await (0, promises_1.access)(crxFilePath);
        return true;
    }
    catch {
        return false;
    }
}
async function removeDirectoryContents(dirPath) {
    if (!(await fileExists(dirPath)))
        return;
    await (0, promises_1.rm)(dirPath, { recursive: true, force: true });
}
//# sourceMappingURL=fs.js.map