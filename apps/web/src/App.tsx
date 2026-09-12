import { Roles, type UserRow } from '@erp-test/shared';
import { useQuery } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getMe } from './api/auth';
import AuthLayout from './components/common/layouts/auth.layout';
import { DashboardLayout } from './components/common/layouts/dashboard.layout';
import PrivateRoute from './components/common/PrivateRoute';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import Forbidden from './pages/common/Forbidden';
import NotFound from './pages/common/NotFound';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Payments } from './pages/dashboard/Payments';
import { Reports } from './pages/dashboard/Reports';
import { Users } from './pages/dashboard/Users';
import { useAuthStore } from './stores/auth.store';
import { Spin } from 'antd';
import { useEffect } from 'react';

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  useEffect(() => {
    if (data) {
      useAuthStore.getState().setUser(data!);
    }
  }, [data]);

  if (isError)
    return <Navigate to="/login" />

  if (isLoading)
    return <Spin fullscreen />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />} >
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />

          <Route element={<PrivateRoute roles={[Roles.PAYMENT]} fallback={<Forbidden />} />} >
            <Route path="payments" element={<Payments />} />
          </Route>

          <Route element={<PrivateRoute roles={[Roles.REPORT]} fallback={<Forbidden />} />} >
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="forbidden" element={<Forbidden />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;