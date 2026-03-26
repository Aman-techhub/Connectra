import { Navigate } from 'react-router-dom';

const RouteProtector =  ({ children }) => {
  const token = localStorage.getItem('userToken');
  const isLoggedIn = !!token && token !== 'null' && token !== 'undefined';

  if (!isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default RouteProtector;
