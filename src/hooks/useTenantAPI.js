// hooks/useTenantAPI.js
import { createTenantAPI, createTenantNoAuthAPI } from "@/api/tenantApi";
import { useEffect, useState } from "react";

export const useTenantAPI = () => {
  const [tenantAPI, setTenantAPI] = useState(null);
  const [tenantNoAuthAPI, setTenantNoAuthAPI] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostParts = window.location.hostname.split(".");

      if (hostParts.length > 1 && hostParts[0] !== "www") {
        const tenant = hostParts[0];
        const baseURL = `https://${tenant}.theplatinumstore.xyz/api`;
        setTenantAPI(createTenantAPI(baseURL));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostParts = window.location.hostname.split(".");

      if (hostParts.length > 1 && hostParts[0] !== "www") {
        const tenant = hostParts[0];
        const baseURL = `https://${tenant}.theplatinumstore.xyz/api`;
        setTenantNoAuthAPI(createTenantNoAuthAPI(baseURL));
      }
    }
  }, []);

  return { tenantAPI, tenantNoAuthAPI };
};
