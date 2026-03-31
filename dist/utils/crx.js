"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchManifest = patchManifest;
exports.zip = zip;
exports.unzip = unzip;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = require("./fs");
async function patchManifest(targetDir, key) {
    const manifestPath = (0, path_1.join)(targetDir, "manifest.json");
    const manifestContent = await (0, promises_1.readFile)(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent);
    manifest.permissions ??= [];
    manifest.permissions.push(...["system.memory", "management"]);
    if (key)
        manifest.key = key;
    await (0, promises_1.writeFile)(manifestPath, JSON.stringify(manifest, null, 2));
    const swPath = (0, path_1.join)(targetDir, manifest.background.service_worker);
    const text = await (0, promises_1.readFile)(swPath, "utf-8");
    await (0, promises_1.writeFile)(swPath, "chrome.runtime.onInstalled.addListener = () => {};" + text);
}
async function zip(src, dest) {
    if (!(await (0, fs_1.fileExists)(src)))
        return;
    const zip = new adm_zip_1.default();
    zip.addLocalFolder(src);
    zip.writeZip(dest);
}
async function unzip(src, dest) {
    if (!(await (0, fs_1.fileExists)(src)))
        return;
    const zip = new adm_zip_1.default(src);
    zip.extractAllTo(dest);
}
//# sourceMappingURL=crx.js.map