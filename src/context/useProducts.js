import { useTenantAPI } from "@/hooks/useTenantAPI";
import Cookies from "js-cookie";
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// Create Context
export const Products = createContext();

// Provider Component
export const ProductsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { tenantAPI } = useTenantAPI();

    const [products, setProducts] = useState([]);

    const fetch_products = async () => {
        const client = Cookies.get('is_client');

        try {
            let res;

            if (client) {
                res = await tenantAPI.get(
                    `/client/product/?page_size=1000`
                );
            } else {
                res = await tenantAPI.get(
                    `/store-owner/product/?page_size=1000`
                );
            }

            if (res?.results?.length > 0) {
                const data = res?.results?.map((item) => ({
                    ...item,
                    value: item?.id,
                    label: item?.name
                }))
                setProducts(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) {
            fetch_products();
        }
    }, [tenantAPI, user]);

    return (
        <Products.Provider value={{ products, setProducts }}>
            {children}
        </Products.Provider>
    );
};

// Custom hook for accessing company details context
export const useProducts = () => useContext(Products);
