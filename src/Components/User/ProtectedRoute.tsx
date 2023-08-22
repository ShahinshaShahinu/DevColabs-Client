import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('user');

  return token ? children : <Navigate to="/login" />;
};


export default ProtectedRoute;




