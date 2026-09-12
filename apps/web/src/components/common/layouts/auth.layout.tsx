import { Card, Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

export default function AuthLayout() {


    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ width: 380, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={3}>Welcome Back</Title>
                    </div>
                    <Outlet />
                </Card>
            </Content>
        </Layout>
    );
}
