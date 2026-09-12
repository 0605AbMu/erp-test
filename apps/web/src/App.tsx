import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Users } from './pages/dashboard/Users';
import { DashboardLayout } from './components/common/layouts/dashboard.layout';
import AuthLayout from './components/common/layouts/auth.layout';
import { Register } from './pages/auth/Register';
import { Payments } from './pages/dashboard/Payments';
import { Reports } from './pages/dashboard/Reports';

function App() {
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
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;