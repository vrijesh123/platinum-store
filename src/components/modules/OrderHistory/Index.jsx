import { useProductCategory } from "@/context/useCategory";
import { useProducts } from "@/context/useProducts";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { CircularProgress, SwipeableDrawer } from "@mui/material";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const { tenantAPI } = useTenantAPI();
  const { products } = useProducts();
  const { categories } = useProductCategory();

  const is_mobile = useMediaQuery("(max-width: 900px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setopenDrawer] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setselectedOrder] = useState(null);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [invoiceLoading, setinvoiceLoading] = useState(false);

  const observerRef = useRef();

  // ✅ Fetch Orders (with pagination)
  const fetchOrders = useCallback(
    async (search = "", pageUrl = null, isLoadMore = false) => {
      try {
        setLoading(true);
        let url = pageUrl || `/store-owner/order/?page=1&order_by=-created_at`;

        if (search) url += `&id_exact=${encodeURIComponent(search)}`;

        const res = await tenantAPI.get(url);

        const newOrders = res?.results || [];

        setOrders((prev) => (isLoadMore ? [...prev, ...newOrders] : newOrders));

        // ✅ cumulative total
        const pageTotal =
          newOrders.reduce(
            (sum, item) => sum + parseFloat(item.total_price),
            0
          ) ?? 0;

        setTotalOrderAmount((prev) =>
          isLoadMore ? prev + pageTotal : pageTotal
        );

        // ✅ store next page link
        setNextPageUrl(res?.links?.next);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    },
    [tenantAPI]
  );

  // ✅ Initial load
  useEffect(() => {
    fetchOrders();
  }, [tenantAPI]);

  // ✅ Infinite Scroll (Intersection Observer)
  const lastOrderRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageUrl) {
          fetchOrders(nextPageUrl, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, nextPageUrl]
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchOrders(term);
  };

  const confirmOrder = async (order) => {
    try {
      const res = await tenantAPI.patch(
        `/store-owner/order/?pk=${order?.id}&mark_accepted=true`
      );
      if (res) {
        fetchRecentOrders();
        fetchMatrix();
        setopenDrawer(false);
      }
    } catch (error) {}
  };

  const cancelOrder = async (order) => {
    try {
      const res = await tenantAPI.patch(
        `/store-owner/order/?pk=${order?.id}&mark_canceled=true`
      );
      fetchRecentOrders();
      fetchMatrix();
      setopenDrawer(false);
    } catch (error) {}
  };

  const downloadInvoice = async () => {
    if (selectedOrder?.invoice) {
      window.open(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}${selectedOrder?.invoice}`,
        "_blank"
      );

      return;
    }

    setinvoiceLoading(true);
    try {
      const res = await tenantAPI.get(
        `/store-owner/order/invoice/?order_id=${selectedOrder?.id}`
      );

      toast.success(res?.message);
      window.open(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}${res?.invoice_url}`,
        "_blank"
      );
    } catch (error) {
      console.log(error);
    } finally {
      setinvoiceLoading(false);
    }
  };

  return (
    <div className="container tenant-container">
      <div className="title">
        <h4>Order History</h4>
      </div>

      <div className="order-history-container">
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

        {orders?.length > 0 ? (
          <div className="orders">
            {orders?.map((item, i) => {
              const isLast = i === orders.length - 1;
              return (
                <div
                  className="order-widget"
                  key={item.id || i}
                  ref={isLast ? lastOrderRef : null} // observe last item
                >
                  <h6 className="line-clamp-1">#ORD{item?.id}</h6>

                  <div className="order-details">
                    <div className="detail">
                      <p className="price">₹{item?.total_price}</p>
                      <p>{item?.api_order_item?.length} items</p>
                    </div>

                    <div
                      className="blue-cta"
                      onClick={() => {
                        setselectedOrder(item);
                        setopenDrawer(true);
                      }}
                    >
                      View Order
                    </div>
                  </div>

                  <div className="date">
                    <p
                      style={{
                        color:
                          item?.status === "accepted"
                            ? "#16A34A"
                            : item?.status === "pending"
                            ? "#FF7A06"
                            : "#D43131",
                      }}
                    >
                      {item?.status}
                    </p>
                    <p>{moment(item?.created_at).format("DD MMM YYYY")}</p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <CircularProgress />
              </div>
            )}
          </div>
        ) : (
          <p
            style={{
              fontSize: "1rem",
              textAlign: "center",
              margin: "200px 0",
            }}
          >
            No Orders Found
          </p>
        )}
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
            maxHeight: { lg: "100vh", md: "90vh" },
            color: "#fff",
            width: { lg: "45vw", md: "100vw" },
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

        <div className="order-details-drawer">
          <div className="stats">
            <div className="stat">
              <p>Total Items</p>
              <span>{selectedOrder?.api_order_item?.length}</span>
            </div>

            <div className="stat">
              <p>Total Order Amount</p>
              <span style={{ color: "#16A34A" }}>
                ₹{selectedOrder?.total_price}
              </span>
            </div>
          </div>

          <div className="order-details">
            <h6>Order Details</h6>

            <div className="orders">
              {selectedOrder?.api_order_item?.map((item, i) => {
                const product = products?.find(
                  (p) => p.id === item?.fields.product
                );
                const category = categories?.find(
                  (c) => c.id === product?.category
                );

                return (
                  <div className="product-detail-widget" key={i}>
                    <div className="product-detail">
                      <span>{category?.name}</span>
                      <p>{product?.name}</p>
                    </div>

                    <div className="price-detail">
                      <p>
                        ₹{item.fields?.price} x {item.fields?.quantity}pcs
                      </p>
                      <span>₹{item.fields?.price * item.fields?.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="contact-details">
            {selectedOrder?.api_client?.length > 0 && (
              <>
                <h6>{selectedOrder?.api_client?.[0]?.fields?.name}</h6>
                <span>
                  +91 {selectedOrder?.api_client?.[0]?.fields?.phone_number}
                </span>
              </>
            )}

            <div className="btns">
              {selectedOrder?.status === "pending" && (
                <button
                  className="red-cta"
                  onClick={() => cancelOrder(selectedOrder)}
                >
                  <div className="icon-container">
                    <img src="/icons/close.svg" alt="" />
                  </div>
                  Cancel
                </button>
              )}

              {selectedOrder?.api_client?.length > 0 && (
                <a
                  href={`tel:${selectedOrder?.api_client?.[0]?.fields?.phone_number}`}
                >
                  <button className="white-cta">
                    <div className="icon-container">
                      <img src="/icons/call.svg" alt="" />
                    </div>
                    Call
                  </button>
                </a>
              )}

              <button className="blue-cta" onClick={downloadInvoice}>
                {invoiceLoading ? (
                  <div className="loading">
                    <CircularProgress size={20} />
                  </div>
                ) : (
                  <>
                    <div className="icon-container">
                      <img src="/icons/task-square.svg" alt="" />
                    </div>
                    Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {selectedOrder?.status === "accepted" ? (
          <div className="bottom-btn confirmed">
            <button className="white-cta">Order Confirmed</button>
          </div>
        ) : selectedOrder?.status === "canceled" ? (
          <div className="bottom-btn canceled">
            <button className="white-cta">Order Canceled</button>
          </div>
        ) : (
          <div className="bottom-btn">
            <button
              className="white-cta"
              onClick={() => confirmOrder(selectedOrder)}
            >
              Confirm Order
            </button>
          </div>
        )}
      </SwipeableDrawer>
    </div>
  );
};

export default OrderHistory;
