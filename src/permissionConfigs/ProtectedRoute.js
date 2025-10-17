import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();


  // useEffect(() => {
  //   if (!loading) {
  //     if (!user) {
  //       router.push('/login');
  //     } else if (allowedRoles && !allowedRoles.includes(user.role)) {
  //       router.push('/unauthorized');
  //     }
  //   }
  // }, [user, loading]);

  // if (loading || !user) {
  //   return <div>Loading...</div>;
  // }

  return children;
};

export default ProtectedRoute;
