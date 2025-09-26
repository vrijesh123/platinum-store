import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LogoutApi, userLoginAPI, userSignUpAPI } from '@/api/loginAPI';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useTenantAPI } from '@/hooks/useTenantAPI';
import { getSubdomain } from '@/utils/commonUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const tenantAPI = useTenantAPI();

    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            const role = localStorage.getItem('role');
            const email = localStorage.getItem('email');
            // retrieve your stored permissions as well
            const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');


            if (token) {
                const decoded = jwtDecode(token);

                const path = decoded?.is_superuser ? 'admin' : 'user';
                const role = decoded?.is_superuser ? 'Captain' : 'User';

                // setUser now also includes the token, role, and email.
                setUser({ ...decoded, token, role, path });

                // set your permissions in React state
                setPermissions(storedPermissions);
            }

            setLoading(false);
        }
    }, []);


    const login = async (username, password) => {
        const subdomain = getSubdomain()
        try {
            const response = await tenantAPI.post('/api/institute/token/', {
                username,
                password,
            });

            console.log('resssss', response, subdomain)

            if (response) {
                const { access, refresh, username, user_id, schema } = response;

                Cookies.set('access_token', access);
                Cookies.set('refresh_token', refresh);

                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);


                // Update react state for user and permissions
                setUser({ ...response });

                // For tenant, redirect to subdomain
                if (process.env.NODE_ENV === 'development') {
                    // In development, use localhost subdomain
                    window.location.href = `http://${subdomain}.localhost:3000/dashboard`;
                } else {
                    // In production, use your actual domain
                    window.location.href = `https://${subdomain}.yourdomain.com/dashboard`;
                }
            } else {
                // Handle unsuccessful login
                toast.error('Something went wrong, Please try again!');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error?.response?.data?.non_field_errors?.[0] || 'Login failed');
        }
    };

    const signup = async (username, first_name, last_name, email, password) => {
        try {
            const response = await userSignUpAPI.post('', {
                username,
                first_name,
                last_name,
                email,
                password,
            });

            if (response) {

                const loginRes = await userLoginAPI.post('', {
                    username,
                    password,
                });

                if (loginRes) {
                    const { access, refresh, is_superuser } = loginRes;
                    localStorage.setItem('access_token', access);
                    localStorage.setItem('refresh_token', refresh);

                    const path = is_superuser ? 'admin' : 'user';
                    const role = is_superuser ? 'Captain' : 'User';


                    localStorage.setItem('role', role);

                    // Store permissions
                    // localStorage.setItem('permissions', JSON.stringify(authenticatedUser.permissions));

                    // Update react state for user and permissions
                    setUser({ ...loginRes, role: role, path: path });
                    // setPermissions(authenticatedUser.permissions);


                    if (is_superuser) {
                        router.push('/admin/dashboard');
                    } else if (!is_superuser) {
                        router.push('/user/dashboard');
                    } else {
                        toast.error('User role not found');
                    }

                } else {
                    // Handle unsuccessful login
                    toast.error('Something went wrong, Please try again!');
                }
            }

        } catch (error) {
            // Handle login error
            console.error('Login error:', error);
            // toast.error(error?.response?.data?.non_field_errors?.[0]);
        }
    };

    const logout = async () => {
        const refreshToken = Cookies.get("refresh_token");

        try {
            await LogoutApi.post("", {
                refresh: refreshToken,
            });

            toast.success('Logged Out Successfully')

            localStorage.clear()
            setUser(null);
            setPermissions([]);
            router.push('/login');
        } catch (error) {

        }
    };

    return (
        <AuthContext.Provider value={{ user, permissions, login, logout, signup, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
