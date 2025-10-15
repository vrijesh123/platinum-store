import { CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react'

const Index = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const access = params.get('access');
        const refresh = params.get('refresh');

        if (access && refresh) {
            Cookies.set('access_token', access);
            Cookies.set('refresh_token', refresh);
            Cookies.set('isStoreOwner', true);

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Redirect to dashboard after setting tokens
            window.location.href = '/dashboard';
        }
    }, []);

    return (
        <div className='loader'>
            <CircularProgress />
        </div>
    )
}

export default Index