
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


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const domain = getSubdomain();
    const token = Cookies.get('access_token');

    if (domain && token) {
      setIsAuthenticated(true);
    }

    setIsReady(true);
  }, []);

  if (!isReady) return null; // prevent hydration mismatch


  return (
    <>
      <ToastContainer position='bottom-right' />
      <AuthProvider>
        {isAuthenticated ? (
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
      </AuthProvider>
    </>
  )
}

