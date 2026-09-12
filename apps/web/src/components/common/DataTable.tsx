import type { Query } from '@erp-test/shared';
import { Table } from 'antd';
import type { TableProps } from 'antd';

export type TableQuery = {} & Query;

type BaseRow = {
    id: string | number;
};

type DataTableProps<T extends BaseRow> = {
    data: T[];
    total: number;
    loading?: boolean;

    query: TableQuery;
    onQueryChange: (query: TableQuery) => void;

    columns: TableProps<T>['columns'];
};

export function DataTable<T extends BaseRow>({
    data,
    total,
    loading,
    query,
    onQueryChange,
    columns,
}: DataTableProps<T>) {
    return (
        <Table<T>
            rowKey="id"
            columns={columns}
            dataSource={data}
            loading={loading}
            showSorterTooltip
            pagination={{
                current: query.page,
                pageSize: query.size,
                total,
                showSizeChanger: true,
                showTotal: (total) => `Jami: ${total}`,
            }}

            onChange={(pagination, filters, sorter) => {
                const sort = Array.isArray(sorter) ? sorter[0] : sorter;
                onQueryChange({
                    page: pagination.current ?? 1,
                    size: pagination.pageSize ?? 10,

                    order:
                        typeof sort?.field === 'string'
                            ? sort.field
                            : undefined,

                    filters,

                    ...(sort?.order === 'descend' ? { desc: 'true' } : {}),
                });
            }}
        />
    );
}