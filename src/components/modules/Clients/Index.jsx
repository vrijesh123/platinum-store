import GlobalForm from "@/components/global_components/GlobalForm";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Call } from "@mui/icons-material";
import { SwipeableDrawer } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const form_json = [
  {
    type: "text",
    name: "name",
    label: "Company / Person Name",
    placeholder: "Enter company / person name",
    fullWidth: true,
    xs: 12,
    validation_message: "Please enter company / person name",
    required: true,
    variant: "outlined",
  },
  {
    type: "tel",
    name: "phone_number",
    label: "Phone number",
    placeholder: "Enter Phone number",
    fullWidth: true,
    xs: 12,
    validation_message: "Please enter phone number",
    required: true,
    variant: "outlined",
  },
];

const Clients = () => {
  const is_mobile = useMediaQuery("(max-width: 900px)");
  const router = useRouter();

  const { tenantAPI } = useTenantAPI();

  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setopenDrawer] = useState(false);
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const res = await tenantAPI.get("/store-owner/client/");

      if (res) {
        setClients(res);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchClients();
  }, [tenantAPI]);

  const handleSubmit = async (values, resetForm) => {
    try {
      await tenantAPI.post("/store-owner/client/", values);

      resetForm();
      fetchClients();
    } catch (error) {
      console.error(error);
    } finally {
      setopenDrawer();
    }
  };

  console.log("Clients", clients);

  return (
    <div className="container tenant-container">
      <div className="title">
        <h4>Clients</h4>
      </div>

      <div className="clients-container">
        <div className="search-container-wrapper">
          <div className="search-container">
            <div className="icon-container">
              <img src={"/icons/searchIcon.svg"} alt="" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.target.value); // call your function here
                }
              }}
              className="search-input"
            />
          </div>

          <button className="black-cta" onClick={() => setopenDrawer(true)}>
            <PlusIcon />
            Add Clients
          </button>
        </div>

        <div className="clients">
          {clients?.results?.map((item, i) => (
            <div className="client-widget" key={i}>
              <div className="left">
                <h6>{item?.name}</h6>

                <div className="business-details">
                  <p style={{ color: "#2142FF" }}>
                    Total Orders: {item?.api_total_orders?.[0]}
                  </p>
                  <p style={{ color: "#16A34A" }}>
                    Total Buy: ₹{item?.api_total_buy?.[0]}
                  </p>
                  <p style={{ color: "#D43131" }}>
                    Outstandings: ₹{item?.api_total_buy?.[0]}
                  </p>
                </div>
              </div>

              <div className="right">
                <button
                  className="white-cta"
                  onClick={() => router.push(`/order-history/${item?.user}`)}
                >
                  Order History
                </button>
                <a href={`tel:${item?.phone_number}`}>
                  <button className="blue-cta">
                    <Call /> Call
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SwipeableDrawer
        anchor={is_mobile ? "bottom" : "right"}
        open={openDrawer}
        onOpen={() => setopenDrawer(true)}
        onClose={() => setopenDrawer(false)}
        disableSwipeToOpen={false}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            height: { lg: "100vh", md: "95vh" },
            color: "#fff",
            width: { lg: "45vw", md: "100vw" },
            padding: "16px",
          },
        }}
      >
        {/* drag handle */}
        {is_mobile && (
          <div
            style={{
              width: 44,
              height: 4,
              borderRadius: 2,
              margin: "10px auto",
              background: "rgba(0,0,0, .7)",
              position: "relative",
            }}
          />
        )}

        <div className="add-client-container">
          <GlobalForm
            form_config={form_json}
            on_Submit={handleSubmit}
            btnClassName={"blue-cta"}
            spacing={1}
          ></GlobalForm>
        </div>

        {/* <div className="bottom-btn">
          <button className="white-cta">Save</button>
        </div> */}
      </SwipeableDrawer>
    </div>
  );
};

export default Clients;
