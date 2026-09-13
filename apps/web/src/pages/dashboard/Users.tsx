import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, type TableQuery } from "../../components/common/DataTable";
import { Flex, Select, Spin, Switch, Tag, type TableProps } from "antd";
import type { UserRow } from "@erp-test/shared";
import { getUsers, updateUser } from "../../api/user";
import { useState } from "react";
import { assignRole, getAllRoles, removeUserRole } from "../../api/auth";

export function AssignRole({ userId, assignedRoleId = [] }: { userId: number, assignedRoleId?: number[] }) {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["roles"],
        queryFn: getAllRoles
    })

    const assignRoleMutation = useMutation({
        mutationFn: ({
            userId,
            roleId,
        }: {
            userId: number;
            roleId: number;
        }) => assignRole(userId, roleId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });

    if (isLoading)
        return <Spin />

    return <>
        <Select
            style={{ width: "100%" }}
            options={data.filter((x: any) => !assignedRoleId.includes(x.id)).map((x: any) => ({ value: x.id, label: x.name }))}
            placeholder="to assign select a role"
            onChange={(value) => {
                console.log(value);
                assignRoleMutation.mutate({ userId: userId, roleId: value })
            }}
        />
    </>
}

export function ModifyRole({ roles, userId }: { roles: { name: string, id: number }[], userId: number }) {
    const queryClient = useQueryClient();

    const removeUserRoleMutation = useMutation({
        mutationFn: ({
            userId,
            roleId,
        }: {
            userId: number;
            roleId: number;
        }) => removeUserRole(userId, roleId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });

    return <>
        <Flex justify="between" gap={"medium"} vertical>
            {roles.map(x =>
                <Tag
                    key={x.id}
                    variant="filled"
                    closable
                    style={{ userSelect: 'none' }}
                    onClose={() => removeUserRoleMutation.mutate({ roleId: x.id, userId: userId })}
                >
                    {x.name.toLocaleUpperCase()}
                </Tag>
            )}

            <AssignRole assignedRoleId={roles.map(x => x.id)} userId={userId} />
        </Flex>
    </>
}

export function Users() {

    const [query, setQuery] = useState<TableQuery>({
        page: 1,
        size: 10,
    });

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['users', query],
        queryFn: () => getUsers(query),
    });

    const updateUserMutation = useMutation({
        mutationFn: ({
            id,
            isActive,
            name,
            surname
        }: {
            id: number;
            isActive: boolean;
            name: string;
            surname: string;
        }) => updateUser({ is_active: isActive, userId: id, name: name, surname: surname }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });

    const columns: TableProps<UserRow>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Surname',
            dataIndex: 'surname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            sorter: true,
            render: (val, row) => {
                return <Switch onChange={(checked) => updateUserMutation.mutate({ id: row.id, isActive: checked, name: row.name, surname: row.surname })} value={val} />
            }
        },
        {
            title: 'Role(s)',
            dataIndex: 'roles',
            render: (_val, row) => {
                return <>
                    <Flex gap={"small"} wrap>
                        {row.roles.map((x) =>
                            <Tag
                                key={x.role_id}
                                closable={false}
                                variant="outlined"
                                color={"blue"}
                            >
                                <span style={{ fontSize: '14px' }}>
                                    {x.name}
                                </span>
                            </Tag>
                        )}
                    </Flex>
                </>
            }
        },
    ];

    return (
        <DataTable<UserRow>
            columns={columns}
            data={data?.items ?? []}
            loading={isLoading}
            total={data?.total ?? 0}
            query={query}
            onQueryChange={setQuery}
        />
    );
}