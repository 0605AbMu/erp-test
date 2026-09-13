import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Roles, type UserRow } from "@erp-test/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Flex, Input, Popconfirm, Select, Space, Spin, Switch, Tag, type TableProps } from "antd";
import { useState } from "react";
import { assignRole, getAllRoles, removeUserRole } from "../../api/auth";
import { createUser, deleteUser, getUsers, updateUser } from "../../api/user";
import { DataTable, type TableQuery } from "../../components/common/DataTable";
import { useAuthStore } from "../../stores/auth.store";
import { UserModal } from "./UserModifyModal";

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
            options={(data ?? [])
                .filter((x: any) => x.name !== Roles.ADMIN && !assignedRoleId.includes(x.id))
                .map((x: any) => ({ value: x.id, label: x.name }))}
            placeholder="Biriktirish uchun rol tanlang"
            onChange={(value) => {
                assignRoleMutation.mutate({ userId: userId, roleId: value! })
                value = undefined;
            }}
        />
    </>
}

export function ModifyRole({ roles, userId }: { roles: { name: string, role_id: number }[], userId: number }) {
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
        <Space vertical>
            <Flex gap={"medium"} wrap justify="flex-start">
                {roles.map(x =>
                    <Tag
                        key={x.role_id}
                        variant="filled"
                        closable
                        color={"blue-inverse"}
                        style={{ userSelect: 'none' }}
                        onClose={() => removeUserRoleMutation.mutate({ roleId: x.role_id, userId: userId })}
                    >
                        {x.name.toLocaleUpperCase()}
                    </Tag>
                )}
            </Flex>
            <AssignRole assignedRoleId={roles.map(x => x.role_id)} userId={userId} />
        </Space>
    </>
}

export function Users() {
    const [modalState, setModalState] = useState(false); //user modify mpdal state
    const [modalUser, setModalUser] = useState<UserRow | undefined>(undefined);

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
            setModalState(false);
        },
    });

    const createUserMutation = useMutation({
        mutationFn: ({
            ...data
        }: {
            name: string;
            surname: string;
            email: string;
            password: string;
        }) => createUser({ ...data }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
            setModalState(false);
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: ({
            ...data
        }: {
            userId: number;
        }) => deleteUser(data.userId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });

    const columns: TableProps<UserRow>['columns'] = [
        {
            title: 'Ism',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Familiya',
            dataIndex: 'surname',
        },
        {
            title: 'Elektron pochta',
            dataIndex: 'email',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <Card>
                    <Space>
                        <Input
                            placeholder="Elektron pochta bo‘yicha qidirish"
                            value={selectedKeys[0]}
                            onChange={(e) => {
                                setSelectedKeys(e.target.value ? [e.target.value] : []);
                            }}
                            onPressEnter={() => confirm()}
                        />
                        <Button type="primary" size="middle" onClick={() => confirm()}><SearchOutlined /></Button>
                    </Space>
                </Card>
            ),
        },
        {
            title: 'Faol',
            dataIndex: 'is_active',
            sorter: true,
            render: (val, row) => {
                return <Popconfirm
                    title={val ? 'Deaktivatsiya qilinsinmi?' : 'Aktivatsiya qilinsinmi?'}
                    onConfirm={() => updateUserMutation.mutate({ id: row.id, isActive: !val, name: row.name, surname: row.surname })}
                    okText="Ha"
                    cancelText="Yo‘q"
                >
                    <Switch checked={val} />
                </Popconfirm>
            }
        },
        {
            title: 'Rollar',
            dataIndex: 'roles',
            render: (_val, row) => {
                return <>
                    {/* <Flex gap={"small"} wrap>
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

                    </Flex> */}

                    <ModifyRole userId={row.id} roles={row.roles} />

                </>
            }
        },
        {
            title: 'Harakatlar',
            render: (_val, row) => {
                return <Flex wrap gap={"middle"}>
                    <Button
                        onClick={() => {
                            setModalUser(row);
                            setModalState(true);
                        }}
                    >
                        <EditOutlined /></Button>
                    {
                        useAuthStore.getState().userId !== row.id &&
                        <Popconfirm title="Haqiqatda o'chirishni istaysizmi?" onConfirm={() => deleteUserMutation.mutate({ userId: row.id })}>
                            <Button danger><DeleteOutlined /></Button>
                        </Popconfirm>
                    }

                </Flex>
            }
        }
    ];

    return (
        <>
            <UserModal open={modalState} onClose={() => {
                setModalState(false);
                setModalUser(undefined);
            }} onSubmit={(values, isEdit) => {
                if (!isEdit)
                    createUserMutation.mutate({
                        name: values.name,
                        surname: values.surname,
                        email: values.email,
                        password: values.password!
                    })
                else updateUserMutation.mutate({
                    id: values.id!,
                    isActive: values.isActive!,
                    name: values.name,
                    surname: values.surname
                })
                setModalUser(undefined);
            }}
                user={modalUser as any}
            />
            <Flex justify="flex-end"><Button type="primary" onClick={() => setModalState(true)}><PlusOutlined /></Button></Flex>
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