import { useTenantAPI } from "@/hooks/useTenantAPI";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create Context
export const ProductCategory = createContext();

// Provider Component
export const CategoryProvider = ({ children }) => {
    const tenantAPI = useTenantAPI();

    const [categories, setCategories] = useState([]);

    const fetch_category = async () => {
        try {
            const res = await tenantAPI.get(
                `/admin/product-category/?page_size=1000`
            );
            if (res?.results?.length > 0) {
                const data = res?.results?.map((item) => ({
                    ...item,
                    value: item?.id,
                    label: item?.name
                }))
                setCategories(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetch_category();
    }, [tenantAPI]);

    return (
        <ProductCategory.Provider value={{ categories, setCategories }}>
            {children}
        </ProductCategory.Provider>
    );
};

// Custom hook for accessing company details context
export const useProductCategory = () => useContext(ProductCategory);
