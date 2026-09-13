import { ReportStatus, Roles, type UserRow } from "@erp-test/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Input, Tag, type TableProps } from "antd";
import { useState } from "react";
import { getAllReports, mockReports } from "../../api/report";
import { DataTable, type TableQuery } from "../../components/common/DataTable";
import { DownloadOutlined } from "@ant-design/icons";
import PrivateComponent from "../../components/common/PrivateComponent";


export function Reports() {
    const queryClient = useQueryClient();

    const [query, setQuery] = useState<TableQuery>({
        page: 1,
        size: 10,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['reports', query],
        queryFn: () => getAllReports(query),
    });

    const mockDataMutation = useMutation({
        mutationFn: () => mockReports(5),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['reports']
            })
        }
    });


    const columns: TableProps<any>['columns'] = [
        {
            title: 'Nomi',
            dataIndex: 'name',
            sorter: true,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <Input
                    placeholder="Nom bo‘yicha qidirish"
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                    }}
                    onPressEnter={() => confirm()}
                />
            ),
        },
        {
            title: 'Turi',
            dataIndex: 'type',
            sorter: true,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <Input
                    placeholder="Tur bo‘yicha qidirish"
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                    }}
                    onPressEnter={() => confirm()}
                />
            ),
        },
        {
            title: 'Holati',
            dataIndex: 'status',
            sorter: true,
            filters: Object.values(ReportStatus).map((val) => ({ text: val, value: val })),
            render: (val) => {
                return <Tag variant="outlined" color={(() => {
                    if (val === ReportStatus.COMPLETED)
                        return "green-inverse";
                    else if (val === ReportStatus.PROCESSING)
                        return "gold-inverse";
                    else if (val === ReportStatus.FAILED)
                        return "red-inverse";
                })()}>
                    {{ pending: 'Kutilmoqda', processing: 'Jarayonda', completed: 'Yakunlangan', failed: 'Xatolik' }[String(val)] ?? val}
                </Tag>
            }
        },
        {
            title: 'Havola',
            dataIndex: 'file_url',
            render: (val) => {
                return <Button href={val} variant="dashed" type="link">
                    <DownloadOutlined />
                </Button>
            }
        }
    ];

    return (<>
        <Flex justify="flex-end">
            <PrivateComponent roles={[Roles.ADMIN]}>
                <Button type="primary" loading={mockDataMutation.isPending} onClick={() => mockDataMutation.mutate()}>5 ta sinov ma’lumotini qo‘shish</Button>
            </PrivateComponent>
        </Flex>
        <DataTable<UserRow>
            columns={columns}
            data={data?.items ?? []}
            loading={isLoading}
            total={data?.total ?? 0}
            query={query}
            onQueryChange={setQuery}
        />
    </>
    );
}