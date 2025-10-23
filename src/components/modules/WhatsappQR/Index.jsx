import { BASE_API_URL } from "@/api/adminApi";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WhatsappQR = () => {
  const { tenantAPI } = useTenantAPI();
  const [loading, setloading] = useState(false);
  const [qr_code, setQr_code] = useState(null);
  const [error, seterror] = useState(null);

  const fetchQrCode = async () => {
    setloading(true);
    try {
      const res = await tenantAPI.get("/store-owner/whatsapp-qr-code/");

      if (res) {
        setQr_code(res?.qr_code_url);
        toast.success(res?.message);
      }
    } catch (error) {
      seterror(error?.response?.data?.error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchQrCode();
  }, [tenantAPI]);

  const whatsappLogout = async () => {
    try {
      const res = await tenantAPI.post("/store-owner/whatsapp-logout/");

      console.log(res);
      toast.success(res?.message);
      seterror(null);
      fetchQrCode();
    } catch (error) {}
  };

  if (loading) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="whatsapp-qr">
      {error && (
        <div className="error">
          <p>{error}</p>
          <button className="red-cta" onClick={whatsappLogout}>
            Disconnect
          </button>
        </div>
      )}
      {qr_code && (
        <div className="qr-container">
          <p>Scan to connect Whatsapp</p>
          <div className="qr-code">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${qr_code}`}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsappQR;
