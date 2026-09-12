import { ReportStatus } from "@erp-test/shared";
import { faker } from "@faker-js/faker";
import { OmitType } from "@nestjs/swagger";

export class Report {
    id: number;
    name: string;
    type: string;
    created_by: number;
    filters?: any;
    status: ReportStatus;
    file_url?: string;
    created_at: Date;
    updated_at: Date;   
}

export class ReportInsert extends OmitType(Report, ['id', 'created_at', 'updated_at']) {};

export const getFakeReports = (creatorId: number): ReportInsert=> {
    return {
        created_by: creatorId,
        name: faker.string.sample(),
        status: faker.helpers.enumValue(ReportStatus),
        type: faker.helpers.arrayElement(['monthly', 'daily', 'yearly']),
        file_url: faker.internet.url({protocol: 'https'}),
        filters: null
    }
}
