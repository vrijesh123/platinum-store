import { ReceiptPDF } from "@/components/global_components/components/ReceiptPDF";
import { useProductCategory } from "@/context/useCategory";
import { useProducts } from "@/context/useProducts";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Close, East, West } from "@mui/icons-material";
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ClientOrderHistory = () => {
  const { tenantAPI } = useTenantAPI();
  const router = useRouter();
  const { id } = router.query;

  const { products } = useProducts();
  const { categories } = useProductCategory();

  const is_mobile = useMediaQuery("(max-width: 900px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setopenDrawer] = useState(false);

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setpaymentLoading] = useState(false);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setselectedOrder] = useState(null);

  const [isClientBlocked, setIsCLientBlocked] = useState(true);

  const [openPunch, setOpenPunch] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [client, setClient] = useState([]);
  const [clientPayments, setclientPayments] = useState(null);

  const [invoiceLoading, setinvoiceLoading] = useState(false);

  const observerRef = useRef();

  const fetchClient = async () => {
    try {
      const res = await tenantAPI.get(`/store-owner/client/?user=${id}`);

      if (res) {
        setClient(res?.results[0] || null);
        setIsCLientBlocked(res?.results[0]?.blocked || false);
      }
    } catch (error) {}
  };

  const fetchPayments = async () => {
    try {
      const res = await tenantAPI.get(
        `/store-owner/client-payment/?user=${id}&page_size=1000&order_by=-created_at`
      );

      if (res) {
        setclientPayments(res?.results || []);
      }
    } catch (error) {}
  };

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
          fetchOrders(nextPageUrl, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, nextPageUrl]
  );

  const confirmOrder = async (order) => {
    try {
      const res = await tenantAPI.patch(
        `/store-owner/order/?pk=${order?.id}&mark_accepted=true`
      );
      fetchPayments();
      fetchOrders();
      fetchClient();
      setopenDrawer(false);
    } catch (error) {}
  };

  const cancelOrder = async (order) => {
    try {
      const res = await tenantAPI.patch(
        `/store-owner/order/?pk=${order?.id}&mark_canceled=true`
      );
      setopenDrawer(false);
      toast.success("Order Cancelled!");
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

  const handleAccess = async (check) => {
    try {
      await tenantAPI.patch(`/store-owner/client/?pk=${client?.id}`, {
        blocked: check,
      });
    } catch (error) {
      console.error("Error updating client access:", error);
    }
  };

  const punchPayment = async () => {
    try {
      await tenantAPI.post("/store-owner/client-payment/", {
        user: client?.user,
        amount: amount,
        payment_method: paymentMode,
      });

      setAmount("");
      setPaymentMode("");
      setOpenPunch(false);
      fetchPayments();
      fetchClient();
    } catch (error) {
      console.error("Error punching payment:", error);
    }
  };

  const downloadReceipt = async (receipt) => {
    if (receipt?.receipt) {
      window.open(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}${receipt?.receipt}`,
        "_blank"
      );

      return;
    }

    setinvoiceLoading(true);

    try {
      const res = await tenantAPI.get(
        `/store-owner/client-payment/receipt/?client_payment_id=${receipt?.id}`
      );

      toast.success(res?.message);
      window.open(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}${res?.receipt_url}`,
        "_blank"
      );
    } catch (error) {
      console.log(error);
    } finally {
      setinvoiceLoading(false);
    }
  };

  const shareStatement = async () => {
    setinvoiceLoading(true);

    try {
      const res = await tenantAPI.post(
        `/store-owner/client/payment-summary/?client_id=${client?.id}`
      );

      if (res?.pdf_bytes) {
        // Convert base64 string to a Blob
        const byteCharacters = atob(res.pdf_bytes);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Create an object URL for the Blob
        const blobUrl = URL.createObjectURL(blob);

        // Open the PDF in a new tab
        window.open(blobUrl, "_blank");

        toast.success(res?.message || "Payment summary opened successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate payment summary");
    } finally {
      setinvoiceLoading(false);
    }
  };

  return (
    <div className="container tenant-container">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          style={{
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
          }}
          onClick={() => router.back()}
          className="back-btn"
        >
          <West />
        </button>
        <h4>{client?.name ?? ""} Order History</h4>
      </div>

      <div className="order-history-container">
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

            <div
              className={`status ${isClientBlocked ? "blocked" : "allowed"}`}
            >
              <p>{isClientBlocked ? "Blocked" : "Allowed"}</p>
            </div>
          </div>

          <label class="switch">
            <input
              type="checkbox"
              checked={!isClientBlocked}
              onChange={(e) => {
                setIsCLientBlocked(!e.target.checked);
                handleAccess(!e.target.checked);
              }}
            />
            <span class="slider round"></span>
          </label>
        </div>

        <div className="payment-history">
          <h6>Payment History</h6>

          {paymentLoading ? (
            <CircularProgress />
          ) : (
            <div className="payments">
              <>
                {clientPayments?.length <= 0 ? (
                  <p style={{ textAlign: "center", marginTop: "1rem" }}>
                    No payments made yet.
                  </p>
                ) : (
                  <>
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
                            {moment(item?.created_at).format(
                              "DD MMM YYYY • HH:MM A"
                            )}
                          </p>
                        </div>

                        {/* <PDFDownloadLink
                          document={
                            <ReceiptPDF
                              data={{
                                id: `PAYMENT-0${item?.id}`,
                                date: `${moment(item?.created_at).format(
                                  "DD MMM YYYY"
                                )}`,
                                paymentMode: `${
                                  item?.payment_method || ""
                                }`.toUpperCase(),
                                billedTo: {
                                  name: `${client?.name}`,
                                  phone: `+91 ${client?.phone_number}`,
                                },
                                from: {
                                  name: "Panda, Inc",
                                  address:
                                    "Business address, City, State, IN – 000 000",
                                },
                                paymentReceived: Number(item?.amount) || 0,
                                totalAmount:
                                  Number(client?.api_total_order_amount?.[0]) ||
                                  0,
                                balance:
                                  Number(
                                    client?.api_total_outstanding_amount?.[0]
                                  ) || 0,
                              }}
                            />
                          }
                          fileName={`receipt-${item.id}.pdf`}
                        >
                          {({ loading }) => (
                            <button className="white-cta">
                              {loading ? "Generating PDF..." : "Receipt"}
                            </button>
                          )}
                        </PDFDownloadLink> */}

                        <button
                          className="white-cta"
                          onClick={() => downloadReceipt(item)}
                          disabled={invoiceLoading}
                        >
                          Receipt
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </>
            </div>
          )}

          <div className="actions">
            <button className="blue-cta" onClick={() => setOpenPunch(true)}>
              Punch Payment
            </button>
            {clientPayments?.length > 0 && (
              <button className="white-cta" onClick={shareStatement}>
                {invoiceLoading ? (
                  <div className="loading">
                    <CircularProgress size={20} />
                  </div>
                ) : (
                  <>Share Statement</>
                )}
              </button>
            )}
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
                Remaining after this payment: ₹{" "}
                {client?.api_total_outstanding_amount?.[0] -
                  (amount ? parseFloat(amount) : 0)}
              </Box>
            </DialogContent>

            <DialogActions sx={{ mt: 2, p: 0 }}>
              <button
                className="blue-cta"
                style={{ width: "100%" }}
                onClick={punchPayment}
              >
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

              {selectedOrder?.status !== "canceled" && (
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
              )}
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
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default ClientOrderHistory;
