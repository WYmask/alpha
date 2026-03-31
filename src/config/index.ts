import { resolve } from "path";
import { Extension, ExtensionType } from "../types/Extension";

const cwd = process.cwd();
const extension = resolve(cwd, "extension");

const [, , extensionId] = process.argv;

export const BROWSER_PATH = resolve(extension, "Chrome");
export const USER_DATA_PATH = resolve(BROWSER_PATH, extensionId || '');
export const PROFILE_PATH = resolve(USER_DATA_PATH, "./Default");
export const EXTENSIONS_PATH = resolve(PROFILE_PATH, "./Extensions");
export const EXTENSIONS_DB_PATH = resolve(PROFILE_PATH, "./IndexedDB");
export const EXTENSIONS_SETTINGS_PATH = resolve(
  PROFILE_PATH,
  "./Local Extension Settings"
);
export const REPORT_PATH = resolve(extension, "report");
export const EXTENSION_ZIP_PATH = resolve(cwd, "extension.zip");
export const EXTENSION_DATA_CACHE_PATH = resolve(extension, "dataCache");
export const DATA_CACHE_PATH = resolve(EXTENSION_DATA_CACHE_PATH, "default");

export const TASK_INTERVAL = 60 * 60 * 1000;

export const VIDEO_SIZE = { width: 1280, height: 1280 };

export const EXTENSIONS: Array<Extension> = [
  {
    name: "OKX Wallet",
    type: ExtensionType.AlphaRadar,
    extensionId: "mcohilncbfahbmgdjkbpemcciiolgcge",
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnLQGK07fyAAjo3mK1lj0D+9mQkOtGJq5uQLbGmMFi8ZR1Mv5d6Gtct6V/hG5O8L1uhNeluRHdfL0HFRaRqdLS7gutUwd1ElXrf5DkywMqWD7MkC6UQ4FXy72Mp/pj34X+bfYiUhkKkbTwBlAUAeKSg81Hm225OW63zG/R72C7f3DVUEK13unn/EPTON+61BdvGyzqi9Bb28GACNV87w1PyQH9vsX+wjQ9ihZ11jKVhZ2cs3A+s5e2i9J9X3OQ/vqrIHVJEooeag3DURIwfGt/Pum0MtwA68yNnBBozviHxYq64hX4CiTPg3cy6FcqFzIcRTgB4S2XI0n1N0bp633YwIDAQAB",
    home: "chrome-extension://mcohilncbfahbmgdjkbpemcciiolgcge/popup.html",
  },
];
