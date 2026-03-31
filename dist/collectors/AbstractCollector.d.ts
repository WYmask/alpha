import { Metrics, MetricsValue } from "../types/Metrics";
import { Collector } from "../types/Collector";
export default abstract class AbstractCollector implements Collector {
    private _ready;
    start(): Promise<void>;
    stop(): Promise<void>;
    isReady(): boolean;
    protected setReady(val: boolean): void;
    abstract getMetrics(): Metrics;
    abstract getMetricsValue(): MetricsValue;
}
//# sourceMappingURL=AbstractCollector.d.ts.map