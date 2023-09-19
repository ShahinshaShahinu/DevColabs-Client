import { ReactNode, useEffect } from 'react';
import { verifyAuth } from '../../utils/auth/adminAuth';
import { useNavigate } from 'react-router-dom';


interface ProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('admin');
  const navigate = useNavigate();
  useEffect(() => {
    const role = token ? verifyAuth(token) : false;
    if (role !== 'admin') {
      navigate('/admin/login');
    }
  }, [token, navigate]);
  return <>{children}</>;
};


export default AdminProtectedRoute;