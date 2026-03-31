"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsRegistry = void 0;
class MetricsRegistry {
    collectors = [];
    async register(collector) {
        if (!collector)
            return;
        try {
            await collector.start();
        }
        catch (error) {
            await collector.stop();
            throw error;
        }
        this.collectors.push(collector);
    }
    async stopAll() {
        await Promise.allSettled(this.collectors.map((c) => c.stop()));
    }
    exportMetrics() {
        return this.collectors.map((c) => c.getMetrics());
    }
    exportMetricsValue() {
        return this.collectors.reduce((map, c) => {
            Object.assign(map, c.getMetricsValue());
            return map;
        }, {});
    }
}
exports.MetricsRegistry = MetricsRegistry;
//# sourceMappingURL=MetricsRegistry.js.map