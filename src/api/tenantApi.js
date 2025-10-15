import APIBase from "@/utils/apiBase";

// Create a factory function for tenant-specific APIs
export const createTenantAPI = (baseURL) => {
    return new APIBase({
        baseURL: baseURL,
        tokenKey: true
        // Add any tenant-specific configuration here
    });
};

export const createTenantNoAuthAPI = (baseURL) => {
    return new APIBase({
        baseURL: baseURL,
        // Add any tenant-specific configuration here
    });
};