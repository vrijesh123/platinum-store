import { createContext, useContext, useState } from 'react';

const TenantContext = createContext();

export const TenantProvider = ({ children, initialTenant }) => {
    const [tenant, setTenant] = useState(initialTenant);

    return (
        <TenantContext.Provider value={{ tenant, setTenant }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);