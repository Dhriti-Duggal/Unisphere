import { Navigate, Outlet } from 'react-router';
import { useUser } from '../../contexts/UserContext';

interface ProtectedRouteProps {
  role?: 'student' | 'teacher' | 'admin';
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user } = useUser();

  // If user is not logged in (e.g., no email/name), redirect to login
  if (!user.email && !user.name) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to their specific dashboard
  if (role && user.role !== role) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
