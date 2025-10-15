
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.css';
import '../styles/main.css';
import '../styles/Landing/styles.css';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/context/AuthContext';
import SideNav from '@/components/global_components/Navbars/SIdeNavbar';
import TopNavbar from '@/components/global_components/Navbars/TopNavbar';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { CategoryProvider } from '@/context/useCategory';
import { ProductsProvider } from '@/context/useProducts';


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    const store_owner = Cookies.get('isStoreOwner');
    const client = Cookies.get('is_client');

    // If the path is /login → always set false
    if (router.pathname === "/login") {
      setIsAdmin(false);
    } else if (client) {
      setIsAdmin(false);
    } else if (store_owner && token) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setIsReady(true);
  }, [router.pathname]);

  if (!isReady) return null; // prevent hydration mismatch


  return (
    <>
      <ToastContainer position='bottom-right' />
      <AuthProvider>
        <CategoryProvider>
          <ProductsProvider>
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
          </ProductsProvider>
        </CategoryProvider>
      </AuthProvider>
    </>
  )
}

