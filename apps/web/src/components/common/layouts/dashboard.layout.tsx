import {
    BankFilled,
    PieChartOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Users', '/dashboard/users', <UserOutlined />),
    getItem('Payments', '/dashboard/payments', <BankFilled />),
    getItem('Reports', '/dashboard/reports', <PieChartOutlined />)
];

export const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();

    return (
        <Layout style={{ minHeight: '100vh', width: '100vw' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                {/* <div>sadasdsd</div> */}
                <div className="demo-logo-vertical" style={{ height: '60px' }} />
                <Menu theme="dark" defaultSelectedKeys={['/users']} mode="inline" items={items} onClick={({ key }) => navigate(key)} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}  />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Test ERP©{currentYear}
                </Footer>
            </Layout>
        </Layout>
    );
};