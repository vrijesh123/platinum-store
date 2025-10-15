import useMediaQuery from "@/hooks/useMediaQuery";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Close } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

const ClientOrderHistory = () => {
  const { tenantAPI } = useTenantAPI();
  const router = useRouter();
  const { id } = router.query;

  const is_mobile = useMediaQuery("(max-width: 900px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setopenDrawer] = useState(false);

  const [loading, setLoading] = useState(false);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setselectedOrder] = useState(null);
  const [access, setAccess] = useState(true);

  const [openPunch, setOpenPunch] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [client, setClient] = useState([]);
  const [clientPayments, setclientPayments] = useState(null);

  const observerRef = useRef();

  const fetchClient = async () => {
    try {
      const res = await tenantAPI.get(`/store-owner/client/?user=${id}`);

      if (res) {
        setClient(res?.results[0] || null);
      }
    } catch (error) {}
  };

  const fetchPayments = async () => {
    try {
      const res = await tenantAPI.get(
        `/store-owner/client-payment/?user=${id}&page_size=1000`
      );

      if (res) {
        setclientPayments(res?.results || []);
      }
    } catch (error) {}
  };

  const payment_history = [
    {
      amount: 130000,
      date: new Date(),
      payment_method: "UPI",
    },
    {
      amount: 130000,
      date: new Date(),
      payment_method: "Cash",
    },
    {
      amount: 130000,
      date: new Date(),
      payment_method: "UPI",
    },
    {
      amount: 130000,
      date: new Date(),
      payment_method: "UPI",
    },
    {
      amount: 130000,
      date: new Date(),
      payment_method: "Bank",
    },
  ];

  const fetchOrders = useCallback(
    async (search = "", pageUrl = null, isLoadMore = false) => {
      try {
        setLoading(true);
        let url =
          pageUrl ||
          `/store-owner/order/?user=${id}&page=1&order_by=-created_at`;

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

  useEffect(() => {
    if (id) {
      fetchClient();
      fetchPayments();
      fetchOrders();
    }
  }, [id, tenantAPI]);

  // ✅ Infinite Scroll (Intersection Observer)
  const lastOrderRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageUrl) {
          console.log("Loading more orders...");
          fetchOrders(nextPageUrl, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, nextPageUrl]
  );

  console.log("Orders", client, clientPayments);

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

        <div className="stats">
          <div className="stat">
            <p>Total Orders</p>
            <span>{client?.api_total_orders?.[0] ?? 0}</span>
          </div>

          <div className="stat">
            <p>Total Order Amount</p>
            <span style={{ color: "#16A34A" }}>
              ₹
              {Number(
                client?.api_total_order_amount?.[0] ?? 0
              ).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="stats">
          <div className="stat paid">
            <p>Paid</p>
            <span>₹{client?.api_total_payment_amount?.[0] ?? 0}</span>
          </div>

          <div className="stat outstanding">
            <p>Outstanding</p>
            <span>₹{client?.api_total_outstanding_amount?.[0]}</span>
          </div>
        </div>

        <div className="access">
          <div className="text">
            <p>Ordering Access</p>
            <span>Client can view your inventory and order.</span>

            <div className={`status ${access ? "allowed" : "blocked"}`}>
              <p>{access ? "Allowed" : "Blocked"}</p>
            </div>
          </div>

          <label class="switch">
            <input
              type="checkbox"
              checked={access}
              onChange={(e) => setAccess(e.target.checked)}
            />
            <span class="slider round"></span>
          </label>
        </div>

        <div className="payment-history">
          <h6>Payment History</h6>

          <div className="payments">
            {clientPayments?.map((item, i) => (
              <div className="payment-widget" key={item?.id}>
                <div className="payment-details">
                  <div className="amount">
                    <p>₹{Number(item?.amount).toLocaleString()}</p>

                    <div
                      className={`payment-type ${
                        item?.payment_method == "upi"
                          ? "upi"
                          : item?.payment_method == "cash"
                          ? "cash"
                          : "bank"
                      }`}
                    >
                      {item?.payment_method}
                    </div>
                  </div>

                  <p className="date">
                    {moment(item?.created_at).format("DD MMM YYYY • HH:MM A")}
                  </p>
                </div>

                <button className="white-cta">Receipt</button>
              </div>
            ))}
          </div>

          <div className="actions">
            <button className="blue-cta" onClick={() => setOpenPunch(true)}>
              Punch Payment
            </button>
            <button className="white-cta">Share Statement</button>
          </div>

          <Dialog
            open={openPunch}
            onClose={() => setOpenPunch(false)}
            PaperProps={{
              sx: { borderRadius: "12px", p: 2, minWidth: 350 },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <DialogTitle sx={{ fontWeight: 600, p: 0 }}>
                Punch Payment
              </DialogTitle>
              <IconButton onClick={() => setOpenPunch(false)}>
                <Close />
              </IconButton>
            </Box>

            <DialogContent sx={{ mt: 1, p: 0 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel sx={{ fontWeight: 500, mb: 0.5 }}>
                  Amount (₹) *
                </FormLabel>
                <TextField
                  type="number"
                  placeholder="Enter amount paid"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  size="small"
                  fullWidth
                />
              </FormControl>

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel sx={{ fontWeight: 500, mb: 1 }}>
                  Payment Mode *
                </FormLabel>
                <RadioGroup
                  row
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <FormControlLabel
                    value="cash"
                    control={<Radio />}
                    label="Cash"
                  />
                  <FormControlLabel
                    value="upi"
                    control={<Radio />}
                    label="UPI"
                  />
                  <FormControlLabel
                    value="bank"
                    control={<Radio />}
                    label="Bank"
                  />
                </RadioGroup>
              </FormControl>

              <Box
                sx={{
                  backgroundColor: "#EEF1FF",
                  color: "#1E3A8A",
                  borderRadius: 1,
                  p: 1,
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                Remaining after this payment: ₹ 200000
              </Box>
            </DialogContent>

            <DialogActions sx={{ mt: 2, p: 0 }}>
              <button className="blue-cta" style={{ width: "100%" }}>
                Save Payment
              </button>
            </DialogActions>
          </Dialog>
        </div>

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
              <span>
                {selectedOrder?.api_generate_invoice?.[0]?.items?.length}
              </span>
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
              {selectedOrder?.api_generate_invoice?.[0]?.items?.map(
                (record, i) => (
                  <div className="product-detail-widget" key={i}>
                    <div className="product-detail">
                      <span>{record?.product_category}</span>
                      <p>{record?.product}</p>
                    </div>

                    <div className="price-detail">
                      <p>
                        ₹{record?.amount} x {record?.quantity}pcs
                      </p>
                      <span>₹{record?.amount * record?.quantity}</span>
                    </div>
                  </div>
                )
              )}

              <div className="total">
                <div className="subtotal">
                  <p>Subtotal:</p>
                  <p>₹{selectedOrder?.total_price}</p>
                </div>
                <div className="grandtotal">
                  <strong>Grand Total:</strong>
                  <strong style={{ color: "#16A34A" }}>
                    ₹{selectedOrder?.total_price}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-details">
            <div className="btns">
              <button className="white-cta">Download Invoice</button>

              <button className="blue-cta">
                <div className="icon-container">
                  <img src="/icons/task-square.svg" alt="" />
                </div>
                Send Invoice
              </button>
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default ClientOrderHistory;
