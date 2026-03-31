import { Collector } from "../types/Collector";
import { Metrics, MetricsValue } from "../types/Metrics";

export class MetricsRegistry {
  private readonly collectors: Collector[] = [];

  async register(collector: Collector | void) {
    if (!collector) return;
    try {
      await collector.start();
    } catch (error) {
      await collector.stop();
      throw error;
    }
    this.collectors.push(collector);
  }

  async stopAll() {
    await Promise.allSettled(this.collectors.map((c) => c.stop()));
  }

  exportMetrics(): Array<Metrics> {
    return this.collectors.map((c) => c.getMetrics());
  }

  exportMetricsValue(): MetricsValue {
    return this.collectors.reduce((map, c) => {
      Object.assign(map, c.getMetricsValue());
      return map;
    }, {});
  }
}
