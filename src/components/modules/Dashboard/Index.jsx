import { adminMatrixApi } from "@/api/adminApi";
import { useAuth } from "@/context/AuthContext";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Close } from "@mui/icons-material";
import { SwipeableDrawer } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const tenantAPI = useTenantAPI();
  const { user } = useAuth();

  const is_mobile = useMediaQuery("(max-width: 900px)");

  const [out_of_stock, setout_of_stock] = useState(true);
  const [low_stock, setlow_stock] = useState(true);
  const [openDrawer, setopenDrawer] = useState(false);

  const [matrix, setmatrix] = useState(null);
  const [recent_orders, setRecent_orders] = useState([]);
  const [loading, setloading] = useState(false);

  const [selectedOrder, setselectedOrder] = useState(null);

  const order_detail = {
    total_item: 355,
    total_amount: 413900,
    details: [
      {
        product: "OLED IC - 16Plus",
        product_code: "GX-Iphone",
        price: 770,
        pcs: 50,
      },
      {
        product: "OLED IC - 16Plus",
        product_code: "GX-Iphone",
        price: 770,
        pcs: 50,
      },
      {
        product: "OLED IC - 16Plus",
        product_code: "GX-Iphone",
        price: 770,
        pcs: 50,
      },
      {
        product: "OLED IC - 16Plus",
        product_code: "GX-Iphone",
        price: 770,
        pcs: 50,
      },
      {
        product: "OLED IC - 16Plus",
        product_code: "GX-Iphone",
        price: 770,
        pcs: 50,
      },
      {
        product: "OLED IC - 16Plus",
        product_code: "GX-Iphone",
        price: 770,
        pcs: 50,
      },
    ],
  };

  const fetchMatrix = async () => {
    try {
      const res = await tenantAPI.get("/admin/matrix/");

      if (res) {
        setmatrix(res);
      }
    } catch (error) {}
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await tenantAPI.get("/admin/order/?depth=True&nested=5");

      if (res) {
        setRecent_orders(res);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMatrix();
    fetchRecentOrders();
  }, [tenantAPI]);

  console.log("Dashboard", user, recent_orders);

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

            <h6 className="value">5000</h6>
          </div>

          <div className="stats">
            <div className="title">
              <div className="icon-container">
                <img src="/icons/people.svg" alt="" />
              </div>
              <p>Total Clients</p>
            </div>

            <h6 className="value">50</h6>
          </div>

          <div className="stats">
            <div className="title">
              <div className="icon-container">
                <img src="/icons/truck-time.svg" alt="" />
              </div>
              <p>Pending Orders</p>
            </div>

            <h6 className="value">5</h6>
          </div>

          <div className="stats">
            <div className="title">
              <div className="icon-container">
                <img src="/icons/calendar.svg" alt="" />
              </div>
              <p>Plan Expiry</p>
            </div>

            <h6 className="value">12 March 2026</h6>
          </div>
        </div>

        <div className="warnings">
          {out_of_stock && (
            <div className="out-of-stock">
              <div className="icon-container">
                <img src="/icons/danger.svg" alt="" />
              </div>

              <div className="content">
                <h6>Out of Stock</h6>
                <p>Your inventory has 10 products with no stock left.</p>

                <Link href={"#"}>View Items</Link>
              </div>
            </div>
          )}

          {low_stock && (
            <div className="low-stock">
              <div className="icon-container">
                <img src="/icons/warning.svg" alt="" />
              </div>

              <div className="content">
                <h6>Low Stock Alert</h6>
                <p>Few items in your inventory will go out of stock Soon</p>

                <Link href={"#"}>View Items</Link>
              </div>

              <button className="close" onClick={() => setlow_stock(false)}>
                <Close sx={{ color: "#FF7A06" }} />
              </button>
            </div>
          )}
        </div>

        <div className="recent-orders">
          <div className="title">
            <h4>Recent Orders</h4>
            <Link href={"#"}>View all</Link>
          </div>

          <div className="orders">
            {recent_orders?.results?.map((item, i) => (
              <div className="order-widget" key={i}>
                <h6 className="line-clamp-1">
                  {item?.api_generate_invoice?.[0]?.client_name}
                </h6>

                <div className="order-details">
                  <div className="detail">
                    <p className="price">₹{item?.total_price}</p>
                    <p>
                      {item?.api_generate_invoice?.[0]?.items?.length} items
                    </p>
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
                  <p>{moment(item?.created_at).format("DD MMM YYYY")}</p>
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
                  (item, i) => (
                    <div className="product-detail-widget" key={i}>
                      <div className="product-detail">
                        <span>{item?.product_category}</span>
                        <p>{item?.product}</p>
                      </div>

                      <div className="price-detail">
                        <p>
                          ₹{item?.amount} x {item?.quantity}pcs
                        </p>
                        <span>₹{item?.amount * item?.quantity}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="contact-details">
              <h6>Shree Mobile Parts</h6>
              <span>Mumbai, Maharashtra</span>

              <div className="numbers">
                <p>+91 9653690236</p>
                <p>+91 8828163421</p>
              </div>

              <div className="btns">
                <button className="white-cta">
                  <div className="icon-container">
                    <img src="/icons/call.svg" alt="" />
                  </div>
                  Call
                </button>

                <button className="blue-cta">
                  <div className="icon-container">
                    <img src="/icons/task-square.svg" alt="" />
                  </div>
                  Send Invoice
                </button>
              </div>
            </div>
          </div>

          <div className="bottom-btn">
            <button className="white-cta">Confirm Order</button>
          </div>
        </SwipeableDrawer>
      </div>
    </div>
  );
}
