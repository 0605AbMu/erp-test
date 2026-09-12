import type { ReactNode } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import type { Roles } from '@erp-test/shared';

interface PrivateComponentProps {
    roles: Roles[];
    children: ReactNode;
    fallback?: ReactNode;
}

export default function PrivateComponent({
    roles,
    children,
    fallback = null,
}: PrivateComponentProps) {
    const { user, hasRole } = useAuthStore()

    if (!user) {
        return <>{fallback}</>;
    }

    if (!hasRole(roles)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}