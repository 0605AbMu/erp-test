import {
    BankFilled,
    LeftOutlined,
    LogoutOutlined,
    MenuOutlined,
    PieChartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
    Breadcrumb,
    Button,
    Grid,
    Layout,
    Menu,
    notification,
    theme,
    Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import { useAuthStore } from '../../../stores/auth.store';
import { logoutApi } from '../../../api/auth';

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
    };
}

const items: MenuItem[] = [
    getItem(
        'Foydalanuvchilar',
        '/dashboard/users',
        <UserOutlined />,
    ),

    getItem(
        'To‘lovlar',
        '/dashboard/payments',
        <BankFilled />,
    ),

    getItem(
        'Hisobotlar',
        '/dashboard/reports',
        <PieChartOutlined />,
    ),
];

export const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const screens = Grid.useBreakpoint();

    const logout = useAuthStore(
        (state) => state.logout,
    );

    const {
        token: {
            colorBgContainer,
            colorBgLayout,
            borderRadiusLG,
        },
    } = theme.useToken();

    const currentYear = new Date().getFullYear();

    const isMobile = !screens.md;

    /**
     * Current active menu
     */
    const selectedKey = useMemo(() => {
        const currentPath = location.pathname;

        const matchedItem = items.find((item) => {
            if (
                !item ||
                Array.isArray(item) ||
                !('key' in item)
            ) {
                return false;
            }

            return currentPath.startsWith(
                String(item.key),
            );
        });

        return matchedItem
            ? [String(matchedItem.key)]
            : [];
    }, [location.pathname]);

    /**
     * Menu click
     */
    const handleMenuClick: MenuProps['onClick'] = ({
        key,
    }) => {
        navigate(String(key));

        if (isMobile) {
            setMobileMenuOpen(false);
        }
    };

    /**
     * Logout
     */
    const handleLogout = async () => {

        try {
            await logoutApi();
        } catch (error: any) {
            notification.error(error.message);
        }

        logout();

        setMobileMenuOpen(false);

        navigate('/login', {
            replace: true,
        });
    };

    /**
     * Menu
     */
    const menu = (
        <Menu
            theme="dark"
            mode="inline"
            items={items}
            selectedKeys={selectedKey}
            onClick={handleMenuClick}
            style={{
                borderInlineEnd: 0,
            }}
        />
    );

    /**
     * Logout button
     */
    const logoutButton = (
        <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
                width: '100%',
                height: 48,
                color: '#fff',

                display: 'flex',
                alignItems: 'center',

                justifyContent: collapsed
                    ? 'center'
                    : 'flex-start',

                padding: collapsed
                    ? 0
                    : '0 24px',

                borderRadius: 0,
            }}
        >
            {!collapsed && 'Chiqish'}
        </Button>
    );

    /**
     * Sidebar header
     */
    const sidebarHeader = (
        <div
            style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',

                justifyContent: collapsed
                    ? 'center'
                    : 'space-between',

                padding: collapsed
                    ? 0
                    : '0 16px',

                flexShrink: 0,
            }}
        >
            {!collapsed && (
                <Typography.Text
                    style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 600,
                    }}
                >
                    Test ERP
                </Typography.Text>
            )}

            <Button
                type="text"
                icon={
                    collapsed
                        ? <MenuOutlined />
                        : <LeftOutlined />
                }
                onClick={() =>
                    setCollapsed((value) => !value)
                }
                style={{
                    color: '#fff',

                    width: 40,
                    height: 40,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                aria-label={
                    collapsed
                        ? 'Yon panelni kengaytirish'
                        : 'Yon panelni yig‘ish'
                }
            />
        </div>
    );

    return (
        <Layout
            style={{
                minHeight: '100vh',
                width: '100%',
                background: colorBgLayout,
            }}
        >
            {/* ================================================= */}
            {/* DESKTOP SIDEBAR */}
            {/* ================================================= */}

            {!isMobile && (
                <Sider
                    collapsed={collapsed}
                    width={240}
                    collapsedWidth={80}

                    /* Ant Design default trigger */
                    trigger={null}

                    style={{
                        position: 'sticky',
                        top: 0,

                        height: '100vh',

                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Sidebar Header */}

                        {sidebarHeader}

                        {/* Menu */}

                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                        >
                            {menu}
                        </div>

                        {/* Logout */}

                        <div
                            style={{
                                flexShrink: 0,

                                borderTop:
                                    '1px solid rgba(255,255,255,0.12)',
                            }}
                        >
                            {logoutButton}
                        </div>
                    </div>
                </Sider>
            )}

            {/* ================================================= */}
            {/* MOBILE SIDEBAR */}
            {/* ================================================= */}

            {isMobile && mobileMenuOpen && (
                <>
                    {/* Overlay */}

                    <div
                        onClick={() =>
                            setMobileMenuOpen(false)
                        }
                        style={{
                            position: 'fixed',
                            inset: 0,

                            zIndex: 999,

                            background:
                                'rgba(0, 0, 0, 0.45)',
                        }}
                    />

                    {/* Sidebar */}

                    <div
                        style={{
                            position: 'fixed',

                            top: 0,
                            left: 0,
                            bottom: 0,

                            width: 260,

                            zIndex: 1000,

                            background: '#001529',

                            boxShadow:
                                '4px 0 12px rgba(0, 0, 0, 0.15)',

                            display: 'flex',
                            flexDirection: 'column',

                            overflow: 'hidden',
                        }}
                    >
                        {/* Mobile Header */}

                        <div
                            style={{
                                height: 64,

                                display: 'flex',
                                alignItems: 'center',
                                justifyContent:
                                    'space-between',

                                padding: '0 16px',

                                flexShrink: 0,
                            }}
                        >
                            <Typography.Text
                                style={{
                                    color: '#fff',
                                    fontSize: 18,
                                    fontWeight: 600,
                                }}
                            >
                                Test ERP
                            </Typography.Text>

                            <Button
                                type="text"
                                icon={
                                    <LeftOutlined />
                                }
                                onClick={() =>
                                    setMobileMenuOpen(
                                        false,
                                    )
                                }
                                style={{
                                    color: '#fff',

                                    width: 40,
                                    height: 40,

                                    display: 'flex',
                                    alignItems:
                                        'center',
                                    justifyContent:
                                        'center',
                                }}
                                aria-label="Menyuni yopish"
                            />
                        </div>

                        {/* Menu */}

                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                            }}
                        >
                            {menu}
                        </div>

                        {/* Logout */}

                        <div
                            style={{
                                flexShrink: 0,

                                borderTop:
                                    '1px solid rgba(255,255,255,0.12)',
                            }}
                        >
                            <Button
                                type="text"
                                icon={
                                    <LogoutOutlined />
                                }
                                onClick={
                                    handleLogout
                                }
                                style={{
                                    width: '100%',
                                    height: 48,

                                    color: '#fff',

                                    display: 'flex',
                                    alignItems:
                                        'center',
                                    justifyContent:
                                        'flex-start',

                                    padding: '0 24px',

                                    borderRadius: 0,
                                }}
                            >
                                Chiqish
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {/* ================================================= */}
            {/* MAIN LAYOUT */}
            {/* ================================================= */}

            <Layout
                style={{
                    minWidth: 0,
                }}
            >
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <Header
                    style={{
                        height: 64,

                        padding: isMobile
                            ? '0 16px'
                            : '0 24px',

                        background:
                            colorBgContainer,

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                            'space-between',

                        borderBottom:
                            '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',

                            gap: 12,
                        }}
                    >
                        {/* Mobile menu button */}

                        {isMobile && (
                            <Button
                                type="text"
                                icon={
                                    <MenuOutlined />
                                }
                                onClick={() =>
                                    setMobileMenuOpen(
                                        true,
                                    )
                                }
                                aria-label="Menyuni ochish"
                            />
                        )}

                        <Typography.Title
                            level={
                                isMobile
                                    ? 5
                                    : 4
                            }
                            style={{
                                margin: 0,
                            }}
                        >
                            Boshqaruv paneli
                        </Typography.Title>
                    </div>
                </Header>

                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <Content
                    style={{
                        margin: isMobile
                            ? '12px'
                            : '16px 24px',

                        minHeight: 0,
                    }}
                >
                    <Breadcrumb
                        style={{
                            marginBottom:
                                isMobile
                                    ? 12
                                    : 16,
                        }}
                    />

                    <div
                        style={{
                            padding: isMobile
                                ? 16
                                : 24,

                            minHeight: 360,

                            background:
                                colorBgContainer,

                            borderRadius:
                                borderRadiusLG,

                            overflow: 'hidden',
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>

                {/* ================================================= */}
                {/* FOOTER */}
                {/* ================================================= */}

                <Footer
                    style={{
                        textAlign: 'center',

                        padding: isMobile
                            ? '16px'
                            : '24px 50px',
                    }}
                >
                    Test ERP © {currentYear}
                </Footer>
            </Layout>
        </Layout>
    );
};