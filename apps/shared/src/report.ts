export enum ReportStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface ReportRow {
    id: number;
    name: string;
    type: string;
    created_by: number;
    filters?: any
    status: ReportStatus;
    file_url?: string;
    created_at: Date;
    updated_at: Date;
}