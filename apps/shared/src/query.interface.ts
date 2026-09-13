export interface Query {
    page: number;
    size: number;
    order?: string;
    desc?: string;
    filters?: string;
}