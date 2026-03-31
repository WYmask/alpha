export interface ScrapeResult {
    htmlContent: string;
    projects?: ProjectInfo[];
}
export interface ProjectInfo {
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
//# sourceMappingURL=Scrape.d.ts.map