import { PaymentMethod, PaymentStatus, Roles, type PaymentRow } from "@erp-test/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Flex, Space, Tag, type TableProps } from "antd";
import { useState } from "react";
import { getAllPayments, mockPayments } from "../../api/payment";
import { DataTable, type TableQuery } from "../../components/common/DataTable";
import PrivateComponent from "../../components/common/PrivateComponent";

export function Payments() {
    const { RangePicker } = DatePicker;
    const queryClient = useQueryClient();

    const [query, setQuery] = useState<TableQuery>({
        page: 1,
        size: 10,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['payments', query],
        queryFn: () => getAllPayments(query),
    });

    const mockDataMutation = useMutation({
        mutationFn: () => mockPayments(5),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['payments']
            })
        }
    });


    const columns: TableProps<PaymentRow>['columns'] = [
        {
            title: "ID",
            dataIndex: "id"
        },
        {
            title: "Tavsif",
            dataIndex: 'description',
            width: 400
        },
        {
            title: 'Miqdori',
            render: (_val, row) => {
                return <>
                    {row.amount} {row.currency}
                </>
            }
        },
        {
            title: "Usuli",
            dataIndex: "method",
            filters: Object.values(PaymentMethod).map((val) => ({ text: val, value: val })),
        },
        {
            title: 'Holati',
            dataIndex: 'status',
            sorter: true,
            filters: Object.values(PaymentStatus).map((val) => ({ text: val, value: val })),
            render: (val) => {
                return <Tag variant="outlined" color={(() => {
                    if (val === PaymentStatus.PAID)
                        return "green-inverse";
                    else if (val === PaymentStatus.PENDING)
                        return "gold-inverse";
                    else if (val === PaymentStatus.FAILED || val === PaymentStatus.REFUNDED)
                        return "red-inverse";
                })()}>
                    {{ pending: 'Kutilmoqda', paid: 'To‘langan', failed: 'Xatolik', refunded: 'Qaytarilgan' }[String(val)] ?? val}
                </Tag>
            }
        },
        {
            title: 'To‘langan sana',
            dataIndex: 'paid_at',
            sorter: true,
            render: (val) => {
                return new Date(val).toLocaleDateString();
            },
            filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
                <Space style={{ padding: 8 }} orientation="vertical">
                    <RangePicker
                        format="DD.MM.YYYY"
                        // value={[]}
                        onChange={(dates) => {
                            if (!dates) {
                                setSelectedKeys([]);
                                return;
                            }
                            setSelectedKeys([dates?.[0] ? dates[0].unix() : 0, dates?.[1] ? dates[1].unix() : 0])
                        }}
                    />

                    <Space>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => confirm()}
                        >
                            Qidirish
                        </Button>
                        <Button
                            size="small"
                            onClick={() => { setSelectedKeys([]); clearFilters?.({ closeDropdown: true, confirm: true }) }}
                        >
                            Tozalash
                        </Button>
                    </Space>
                </Space>
            ),
        }
    ];

    return (<>
        <Flex justify="flex-end">
            <PrivateComponent roles={[Roles.ADMIN]}>
                <Button type="primary" loading={mockDataMutation.isPending} onClick={() => mockDataMutation.mutate()}>5 ta sinov ma’lumotini qo‘shish</Button>
            </PrivateComponent>
        </Flex>
        <DataTable<PaymentRow>
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