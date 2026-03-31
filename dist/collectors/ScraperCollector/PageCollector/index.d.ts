import { type BrowserContext } from 'playwright';
import AbstractCollector from '../../AbstractCollector';
import { Metrics, MetricsValue } from '../../../types/Metrics';
import { Extension } from '../../../types/Extension';
export declare class PageCollector extends AbstractCollector {
    private readonly extension;
    private readonly browser;
    private readonly value;
    constructor(extension: Extension, browser: BrowserContext);
    start(): Promise<void>;
    getHtmlContent(): string;
    getMetrics(): Metrics;
    getMetricsValue(): MetricsValue;
}
//# sourceMappingURL=index.d.ts.map