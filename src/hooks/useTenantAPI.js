// hooks/useTenantAPI.js
import { createTenantAPI } from '@/api/tenantApi';
import { useEffect, useState } from 'react';

export const useTenantAPI = () => {
    const [tenantAPI, setTenantAPI] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hostParts = window.location.hostname.split('.');

            if (hostParts.length > 1 && hostParts[0] !== 'www') {
                const tenant = hostParts[0];
                const baseURL = `http://${tenant}.theplatinumstore.xyz/api`;
                setTenantAPI(createTenantAPI(baseURL));
            }
        }
    }, []);

    return tenantAPI;
};