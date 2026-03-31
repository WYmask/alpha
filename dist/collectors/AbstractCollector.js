"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractCollector {
    _ready = false;
    async start() {
        this._ready = true;
    }
    async stop() {
        /* document why this async method 'stop' is empty */
    }
    isReady() {
        return this._ready;
    }
    setReady(val) {
        this._ready = val;
    }
}
exports.default = AbstractCollector;
//# sourceMappingURL=AbstractCollector.js.map