import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title="403"
            subTitle="Bu sahifaga kirish uchun sizda ruxsat mavjud emas."
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    Bosh sahifaga qaytish
                </Button>
            }
        />
    );
}