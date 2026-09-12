import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import type { Roles } from '@erp-test/shared';

export default function PrivateRoute({ roles, fallback }: { roles: Roles[], fallback: React.ReactNode }) {
    const { isAuthenticated, hasRole } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (!hasRole(roles))
        return <>{fallback}</>

    return <Outlet />;
}