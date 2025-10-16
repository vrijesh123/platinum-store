import { useTenantAPI } from "@/hooks/useTenantAPI";
import Cookies from "js-cookie";
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// Create Context
export const ProductCategory = createContext();

// Provider Component
export const CategoryProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { tenantAPI } = useTenantAPI();

    const [categories, setCategories] = useState([]);

    const fetch_category = async () => {
        const client = Cookies.get('is_client');

        try {
            let res;

            if (client) {
                res = await tenantAPI.get(
                    `/client/product-category/?page_size=1000`
                );
            } else {
                res = await tenantAPI.get(
                    `/store-owner/product-category/?page_size=1000`
                );
            }

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
        const token = Cookies.get('access_token');
        if (token) {
            fetch_category();
        }
    }, [tenantAPI]);

    return (
        <ProductCategory.Provider value={{ categories, setCategories }}>
            {children}
        </ProductCategory.Provider>
    );
};

// Custom hook for accessing company details context
export const useProductCategory = () => useContext(ProductCategory);
