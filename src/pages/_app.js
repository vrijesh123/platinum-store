
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.css';
import '../styles/main.css';
import '../styles/Landing/styles.css';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/permissionConfigs/ProtectedRoute';
import SideNav from '@/components/global_components/Navbars/SIdeNavbar';
import TopNavbar from '@/components/global_components/Navbars/TopNavbar';
import { ROLES } from '@/utils/constants';
import { getSubdomain } from '@/utils/commonUtils';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { CategoryProvider } from '@/context/useCategory';


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    const user = Cookies.get('user');

    if (user && token) {
      setIsAdmin(true);
    }

    setIsReady(true);
  }, []);

  if (!isReady) return null; // prevent hydration mismatch


  return (
    <>
      <ToastContainer position='bottom-right' />
      <AuthProvider>
        <CategoryProvider>
          {isAdmin ? (
            // <ProtectedRoute allowedRoles={protectedRoute?.roles}>
            <>
              <SideNav />
              <main className="main">
                <TopNavbar />
                <div className="main-body">
                  <Component {...pageProps} />
                </div>
              </main>
            </>
            // </ProtectedRoute>
          ) : (
            <>
              <Component {...pageProps} />
            </>
          )}
        </CategoryProvider>
      </AuthProvider>
    </>
  )
}

