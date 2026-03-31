import { Collector } from "../types/Collector";
import { Metrics, MetricsValue } from "../types/Metrics";
export declare class MetricsRegistry {
    private readonly collectors;
    register(collector: Collector | void): Promise<void>;
    stopAll(): Promise<void>;
    exportMetrics(): Array<Metrics>;
    exportMetricsValue(): MetricsValue;
}
//# sourceMappingURL=MetricsRegistry.d.ts.map