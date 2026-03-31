"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setExtensionData = setExtensionData;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fs_1 = require("../../utils/fs");
const crx_1 = require("../../utils/crx");
const config_1 = require("../../config");
async function setExtensionData(extensionId, key) {
    await (0, fs_1.removeDirectoryContents)(config_1.EXTENSIONS_PATH);
    await (0, fs_1.removeDirectoryContents)(config_1.EXTENSIONS_DB_PATH);
    await (0, fs_1.removeDirectoryContents)(config_1.EXTENSIONS_SETTINGS_PATH);
    await (0, promises_1.mkdir)(config_1.EXTENSIONS_PATH, { recursive: true });
    await (0, promises_1.mkdir)(config_1.EXTENSIONS_DB_PATH, { recursive: true });
    await (0, promises_1.mkdir)(config_1.EXTENSIONS_SETTINGS_PATH, { recursive: true });
    await (0, promises_1.mkdir)(config_1.DATA_CACHE_PATH, { recursive: true });
    await (0, promises_1.cp)(config_1.DATA_CACHE_PATH, config_1.PROFILE_PATH, { recursive: true, force: true });
    const extensionPath = (0, path_1.resolve)(config_1.EXTENSIONS_PATH, extensionId);
    if (!(await (0, fs_1.fileExists)(config_1.EXTENSIONS_PATH)))
        console.log('EXTENSIONS_PATH not exists', config_1.EXTENSIONS_PATH);
    else
        console.log('EXTENSIONS_PATH exists', config_1.EXTENSIONS_PATH);
    if (!(await (0, fs_1.fileExists)(config_1.EXTENSION_DATA_CACHE_PATH)))
        console.log('EXTENSION_DATA_CACHE_PATH not exists', config_1.EXTENSION_DATA_CACHE_PATH);
    else
        console.log('EXTENSION_DATA_CACHE_PATH exists', config_1.EXTENSION_DATA_CACHE_PATH);
    if (!(await (0, fs_1.fileExists)(config_1.BROWSER_PATH)))
        console.log('BROWSER_PATH not exists', config_1.BROWSER_PATH);
    else
        console.log('BROWSER_PATH exists', config_1.BROWSER_PATH);
    await (0, crx_1.patchManifest)(extensionPath, key);
}
//# sourceMappingURL=index.js.map