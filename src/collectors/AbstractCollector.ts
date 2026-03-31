import { Metrics, MetricsValue } from "../types/Metrics";
import { Collector } from "../types/Collector";

export default abstract class AbstractCollector implements Collector {
  private _ready = false;

  async start(): Promise<void> {
    this._ready = true;
  }

  async stop(): Promise<void> {
    /* document why this async method 'stop' is empty */
  }

  isReady(): boolean {
    return this._ready;
  }

  protected setReady(val: boolean) {
    this._ready = val;
  }

  abstract getMetrics(): Metrics;

  abstract getMetricsValue(): MetricsValue;
}
