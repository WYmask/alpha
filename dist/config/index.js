"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENSIONS = exports.VIDEO_SIZE = exports.TASK_INTERVAL = exports.DATA_CACHE_PATH = exports.EXTENSION_DATA_CACHE_PATH = exports.EXTENSION_ZIP_PATH = exports.REPORT_PATH = exports.EXTENSIONS_SETTINGS_PATH = exports.EXTENSIONS_DB_PATH = exports.EXTENSIONS_PATH = exports.PROFILE_PATH = exports.USER_DATA_PATH = exports.BROWSER_PATH = void 0;
const path_1 = require("path");
const Extension_1 = require("../types/Extension");
const cwd = process.cwd();
const extension = (0, path_1.resolve)(cwd, "extension");
const [, , extensionId] = process.argv;
exports.BROWSER_PATH = (0, path_1.resolve)(extension, "Chrome");
exports.USER_DATA_PATH = (0, path_1.resolve)(exports.BROWSER_PATH, extensionId || '');
exports.PROFILE_PATH = (0, path_1.resolve)(exports.USER_DATA_PATH, "./Default");
exports.EXTENSIONS_PATH = (0, path_1.resolve)(exports.PROFILE_PATH, "./Extensions");
exports.EXTENSIONS_DB_PATH = (0, path_1.resolve)(exports.PROFILE_PATH, "./IndexedDB");
exports.EXTENSIONS_SETTINGS_PATH = (0, path_1.resolve)(exports.PROFILE_PATH, "./Local Extension Settings");
exports.REPORT_PATH = (0, path_1.resolve)(extension, "report");
exports.EXTENSION_ZIP_PATH = (0, path_1.resolve)(cwd, "extension.zip");
exports.EXTENSION_DATA_CACHE_PATH = (0, path_1.resolve)(extension, "dataCache");
exports.DATA_CACHE_PATH = (0, path_1.resolve)(exports.EXTENSION_DATA_CACHE_PATH, "default");
exports.TASK_INTERVAL = 60 * 60 * 1000;
exports.VIDEO_SIZE = { width: 1280, height: 1280 };
exports.EXTENSIONS = [
    {
        name: "OKX Wallet",
        type: Extension_1.ExtensionType.AlphaRadar,
        extensionId: "mcohilncbfahbmgdjkbpemcciiolgcge",
        key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnLQGK07fyAAjo3mK1lj0D+9mQkOtGJq5uQLbGmMFi8ZR1Mv5d6Gtct6V/hG5O8L1uhNeluRHdfL0HFRaRqdLS7gutUwd1ElXrf5DkywMqWD7MkC6UQ4FXy72Mp/pj34X+bfYiUhkKkbTwBlAUAeKSg81Hm225OW63zG/R72C7f3DVUEK13unn/EPTON+61BdvGyzqi9Bb28GACNV87w1PyQH9vsX+wjQ9ihZ11jKVhZ2cs3A+s5e2i9J9X3OQ/vqrIHVJEooeag3DURIwfGt/Pum0MtwA68yNnBBozviHxYq64hX4CiTPg3cy6FcqFzIcRTgB4S2XI0n1N0bp633YwIDAQAB",
        home: "chrome-extension://mcohilncbfahbmgdjkbpemcciiolgcge/popup.html",
    },
];
//# sourceMappingURL=index.js.map