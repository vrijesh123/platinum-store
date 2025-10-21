import GlobalForm from "@/components/global_components/GlobalForm";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Call } from "@mui/icons-material";
import { CircularProgress, SwipeableDrawer } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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
  const { tenantAPI } = useTenantAPI();
  const router = useRouter();
  const observerRef = useRef();

  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setopenDrawer] = useState(false);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const [openEdit, setopenEdit] = useState(false);
  const [editClient, setEditClient] = useState(null);

  const [openMenu, setOpenMenu] = useState(null); // track which client's menu is open

  const [submitting, setSubmitting] = useState(false);

  const handleMenuToggle = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  // ✅ Fetch clients (supports pagination + search)
  const fetchClients = useCallback(
    async (pageUrl = null, isLoadMore = false, search = "") => {
      try {
        setLoading(true);

        let url =
          pageUrl ||
          `/store-owner/client/?order_by=-created_at&page=1${
            search ? `&name=${encodeURIComponent(search)}` : ""
          }`;

        const res = await tenantAPI.get(url);
        const newClients = res?.results || [];

        setClients((prev) =>
          isLoadMore ? [...prev, ...newClients] : newClients
        );
        setNextPageUrl(res?.links?.next);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setLoading(false);
      }
    },
    [tenantAPI]
  );

  // ✅ Initial fetch
  useEffect(() => {
    fetchClients(null, false, searchTerm);
  }, [tenantAPI]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchClients(null, false, term);
  };

  // ✅ Infinite scroll observer
  const lastClientRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageUrl) {
          fetchClients(nextPageUrl, true, searchTerm);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, nextPageUrl, searchTerm]
  );

  const handleSubmit = async (values, resetForm) => {
    setSubmitting(true);
    try {
      await tenantAPI.post("/store-owner/client/", values);

      resetForm();
      fetchClients();
    } catch (error) {
      console.error(error);
    } finally {
      setopenDrawer(false);
      setSubmitting(false);
    }
  };

  const handleEdit = async (values, resetForm) => {
    try {
      await tenantAPI.patch(`/store-owner/client/?pk=${values?.id}`, {
        name: values?.name,
        phone_number: values?.phone_number,
      });

      resetForm();
      fetchClients();
    } catch (error) {
      console.error(error);
    } finally {
      setopenEdit(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await tenantAPI.delete(`/store-owner/client/?pk=${id}`);

      setClients((prev) => prev.filter((p) => p.id !== id));
      toast.success("Client deleted successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setOpenMenu(null);
    }
  };

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
          {clients?.map((item, i) => {
            const isLast = i === clients.length - 1;
            return (
              <div
                className="client-widget"
                key={item.id || i}
                ref={isLast ? lastClientRef : null}
              >
                <div className="left">
                  <h6>{item?.name}</h6>

                  <div className="business-details">
                    <p>Total Orders: {item?.api_total_orders?.[0]}</p>
                    <p style={{ color: "#16A34A" }}>
                      Total Buy: ₹{item?.api_total_buy?.[0]}
                    </p>
                    <p style={{ color: "#D43131" }}>
                      Outstandings: ₹{item?.api_total_buy?.[0]}
                    </p>
                  </div>
                </div>

                <div className="actions">
                  <button
                    className="option"
                    onClick={() => handleMenuToggle(i)}
                  >
                    <img src="/icons/options.svg" alt="" />
                  </button>

                  {openMenu === i && (
                    <div className="dropdown-menu">
                      <button
                        onClick={() => {
                          const edit_data = {
                            id: item?.id,
                            name: item?.name,
                            phone_number: item?.phone_number,
                          };
                          setEditClient(edit_data);
                          setopenEdit(true);
                          setOpenMenu(null);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item?.id)}>
                        Delete
                      </button>
                    </div>
                  )}
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
            );
          })}

          {/* ✅ Loading indicator */}
          {loading && (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              <CircularProgress />
            </p>
          )}

          {/* ✅ No data */}
          {!loading && clients?.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              No clients found.
            </p>
          )}
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
            is_submitting={submitting}
          ></GlobalForm>
        </div>
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor={is_mobile ? "bottom" : "right"}
        open={openEdit}
        onOpen={() => setopenEdit(true)}
        onClose={() => setopenEdit(false)}
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
            editingValues={editClient}
            on_Submit={handleEdit}
            btnClassName={"blue-cta"}
            spacing={1}
          ></GlobalForm>
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default Clients;
