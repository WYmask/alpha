import AbstractCollector from "../AbstractCollector";
import { Metrics, MetricsValue } from "../../types/Metrics";
import { Extension } from "../../types/Extension";
interface ProjectInfo {
    name: string;
    twitterHandle: string;
    twitterUrl: string;
    description: string;
    score: string;
    followers: string;
    time: string;
    status: string;
    type: string;
    category: string;
    kolFollowers?: number;
}
export declare class ScraperCollector extends AbstractCollector {
    private readonly extension;
    private readonly headless;
    private readonly registry;
    private browser;
    private collectedProjects;
    constructor(extension: Extension, headless: boolean);
    start(): Promise<void>;
    /**
     * 验证项目并生成报告
     */
    validateAndGenerateReport(): Promise<string>;
    stop(): Promise<void>;
    getMetrics(): Metrics;
    getMetricsValue(): MetricsValue;
    getCollectedProjects(): ProjectInfo[];
}
export {};
//# sourceMappingURL=index.d.ts.map