export interface Query {
    page: number;
    size: number;
    order?: string;
    desc?: string;
    filters?: Record<string, unknown>;
}