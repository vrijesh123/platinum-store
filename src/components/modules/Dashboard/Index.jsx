import { adminMatrixApi, BASE_API_URL } from "@/api/adminApi";
import { AuthContext, useAuth } from "@/context/AuthContext";
import { useProductCategory } from "@/context/useCategory";
import { useProducts } from "@/context/useProducts";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Call, Close } from "@mui/icons-material";
import { CircularProgress, SwipeableDrawer } from "@mui/material";
import { BellIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { tenantAPI } = useTenantAPI();
  const { user } = useContext(AuthContext);
  const { products } = useProducts();
  const { categories } = useProductCategory();

  const is_mobile = useMediaQuery("(max-width: 900px)");

  const [openDrawer, setopenDrawer] = useState(false);

  const [matrix, setmatrix] = useState(null);
  const [recent_orders, setRecent_orders] = useState([]);
  const [loading, setloading] = useState(false);

  const [selectedOrder, setselectedOrder] = useState(null);
  const [low_stock, setlow_stock] = useState(true);

  const [invoiceLoading, setinvoiceLoading] = useState(false);
  const [outstandingLoading, setOutstandingLoading] = useState(false);

  const fetchMatrix = async () => {
    try {
      const res = await tenantAPI.get("/store-owner/matrix?stats=all");

      if (res) {
        setmatrix(res);
      }
    } catch (error) {}
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await tenantAPI.get(
        "/store-owner/order/?depth=5&nested=True&order_by=-created_at"
      );

      if (res) {
        setRecent_orders(res);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMatrix();
    fetchRecentOrders();
  }, [tenantAPI]);

  useEffect(() => {
    if (matrix?.product_with_lowest_stock?.some((item) => item?.stock <= 10)) {
      setlow_stock(true);
    } else {
      setlow_stock(false);
    }
  }, [matrix]);

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
      if (res) {
        fetchRecentOrders();
        fetchMatrix();
        setopenDrawer(false);
      }
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

  const sendReminder = async (client) => {
    setOutstandingLoading(true);
    try {
      const res = await tenantAPI.post(
        `/store-owner/client/outstanding-reminder/?client_id=${client?.id}`
      );

      toast.success(res?.message);
    } catch (error) {
      console.log(error);
    } finally {
      setOutstandingLoading(false);
    }
  };

  // console.log("Dashboard", recent_orders);

  return (
    <div className="container tenant-container">
      <div className="title">
        <h4>Welcome User,</h4>
      </div>

      <div className="dashboard-container">
        <div className="statistics">
          <div className="stats">
            <div className="title">
              <div className="icon-container">
                <img src="/icons/box.svg" alt="" />
              </div>
              <p>Total Products</p>
            </div>

            <h6 className="value">{matrix?.total_products ?? 0}</h6>
          </div>

          <div className="stats">
            <div className="title">
              <div className="icon-container">
                <img src="/icons/people.svg" alt="" />
              </div>
              <p>Total Clients</p>
            </div>

            <h6 className="value">{matrix?.total_clients ?? 0}</h6>
          </div>

          <div className="stats">
            <div className="title">
              <div className="icon-container">
                <img src="/icons/truck-time.svg" alt="" />
              </div>
              <p>Pending Orders</p>
            </div>

            <h6 className="value">{matrix?.pending_orders ?? 0}</h6>
          </div>

          <div className="stats">
            <div className="title">
              <div className="icon-container">
                <img src="/icons/calendar.svg" alt="" />
              </div>
              <p>Plan Expiry</p>
            </div>

            <h6 className="value">
              {moment(matrix?.plan_expiry).format("D MMM YYYY")}
            </h6>
          </div>
        </div>

        <div className="warnings">
          {matrix?.product_with_zero_stock_list?.length > 0 && (
            <div className="out-of-stock">
              <div className="icon-container">
                <img src="/icons/danger.svg" alt="" />
              </div>

              <div className="content">
                <h6>Out of Stock</h6>
                <p>
                  Your inventory has{" "}
                  {matrix?.product_with_zero_stock_list?.length} products with
                  no stock left.
                </p>

                <Link href={"/products"}>View Items</Link>
              </div>
            </div>
          )}

          {low_stock > 0 && (
            <div className="low-stock">
              <div className="icon-container">
                <img src="/icons/warning.svg" alt="" />
              </div>

              <div className="content">
                <h6>Low Stock Alert</h6>
                <p>Few items in your inventory will go out of stock Soon</p>

                <Link href={"/products"}>View Items</Link>
              </div>

              <button className="close" onClick={() => setlow_stock(false)}>
                <Close sx={{ color: "#FF7A06" }} />
              </button>
            </div>
          )}
        </div>

        <div className="top-outstandings">
          <div className="title">
            <h4>Top Outstanding</h4>
          </div>
          {matrix?.client_by_top_outstanding?.length <= 0 ? (
            <div style={{ margin: "100px", textAlign: "center" }}>
              <p>No Outstandings Found</p>
            </div>
          ) : (
            <div className="outstandings">
              {matrix?.client_by_top_outstanding?.map((item, i) => (
                <div className="out-standing-widget" key={item?.id}>
                  <Link href={`/order-history/${item?.user}`}>
                    <div className="details">
                      <div className="info">
                        <p>{item?.name}</p>
                        <span>
                          Total Buy: ₹
                          {Number(item?.total_order).toLocaleString()}
                        </span>
                        <br />

                        <span style={{ color: "#2142FF" }}>
                          Total Payment: ₹
                          {Number(item?.total_payment).toLocaleString()}
                        </span>
                      </div>

                      <div className="outstanding">
                        <p>₹{Number(item?.outstanding).toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>

                  <div className="actions">
                    <button
                      className="white-cta"
                      onClick={() => sendReminder(item)}
                    >
                      {outstandingLoading ? (
                        <div className="loading">
                          <CircularProgress size={20} />
                        </div>
                      ) : (
                        <>
                          <BellIcon />
                          Remind
                        </>
                      )}
                    </button>
                    <a href={`tel:${item?.phone_number}`}>
                      <button className="blue-cta">
                        <Call />
                        Call
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="recent-orders">
          <div className="title">
            <h4>Recent Orders</h4>
            {recent_orders?.results?.length > 0 && (
              <Link href={"/order-history"}>View all</Link>
            )}
          </div>

          {recent_orders?.results?.length > 0 ? (
            <div className="orders">
              {recent_orders?.results?.map((item, i) => (
                <div className="order-widget" key={i}>
                  <h6 className="line-clamp-1">
                    {item?.api_client?.[0]?.fields?.name ?? "-"}
                  </h6>

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
              ))}
            </div>
          ) : (
            <div style={{ margin: "100px", textAlign: "center" }}>
              <p>No Recent Orders Available</p>
            </div>
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
              maxHeight: { lg: "100vh", md: "95vh" },
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
                        <span>
                          ₹{item.fields?.price * item.fields?.quantity}
                        </span>
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
    </div>
  );
}
