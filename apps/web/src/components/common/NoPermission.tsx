import { CustomerServiceOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import Text from 'antd/es/typography/Text';

type NoPermissionProps = {
    title?: string;
    subTitle?: string;
};

export function NoPermission({
}: NoPermissionProps) {
    return (
        <div className="no-role-access">
            <div className="no-role-icon">
                <div className="no-role-icon-ring">
                    <SafetyCertificateOutlined />
                </div>

                <div className="no-role-pulse" />
            </div>

            <Result
                status="info"
                title="Ruxsat mavjud emas"
                subTitle={
                    <>
                        <div>
                            Sizning hisobingizga hozircha hech qanday rol
                            biriktirilmagan.
                        </div>

                        <Text type="secondary">
                            Tizimdan foydalanish uchun Support xizmatiga
                            murojaat qiling.
                        </Text>
                    </>
                }
                extra={
                    <Button
                        type="primary"
                        size="large"
                        icon={<CustomerServiceOutlined />}
                    // onClick={onContactSupport}
                    >
                        Support bilan bog‘lanish
                    </Button>
                }
            />
        </div>
    );
}