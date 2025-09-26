import { Close } from "@mui/icons-material";
import { SwipeableDrawer } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [out_of_stock, setout_of_stock] = useState(true);
  const [low_stock, setlow_stock] = useState(true);
  const [openDrawer, setopenDrawer] = useState(false);

  const recent_orders = [
    {
      title: "Shree Mobile Parts",
      total: 10500,
      items: 50,
      created_at: new Date(),
    },
    {
      title: "Rajdeep Displays",
      total: 15200,
      items: 20,
      created_at: new Date(),
    },
    {
      title: "Kumar Electronics Mart",
      total: 8750,
      items: 5,
      created_at: new Date(),
    },
    {
      title: "Kumar Electronics Mart",
      total: 10500,
      items: 50,
      created_at: new Date(),
    },
  ];

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
            {recent_orders?.map((item, i) => (
              <div className="order-widget" key={i}>
                <h6 className="line-clamp-1">{item?.title}</h6>

                <div className="order-details">
                  <div className="detail">
                    <p className="price">₹{item?.total}</p>
                    <p>{item?.items} items</p>
                  </div>

                  <div className="blue-cta" onClick={() => setopenDrawer(true)}>
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
          anchor="bottom"
          open={openDrawer}
          onOpen={() => setopenDrawer(true)}
          onClose={() => setopenDrawer(false)}
          disableSwipeToOpen={false}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              maxHeight: "90vh",
              color: "#fff",
            },
          }}
        >
          {/* drag handle */}
          <div
            style={{
              width: 44,
              height: 4,
              borderRadius: 2,
              margin: "10px auto",
              background: "rgba(0,0,0, .7)",
            }}
          />

          <div className="order-details-drawer">
            <div className="stats">
              <div className="stat">
                <p>Total Items</p>
                <span>{order_detail?.total_item}</span>
              </div>

              <div className="stat">
                <p>Total Order Amount</p>
                <span style={{ color: "#16A34A" }}>
                  ₹{order_detail?.total_amount}
                </span>
              </div>
            </div>

            <div className="order-details">
              <h6>Order Details</h6>

              <div className="orders">
                {order_detail?.details?.map((item, i) => (
                  <div className="product-detail-widget" key={i}>
                    <div className="product-detail">
                      <span>{item?.product_code}</span>
                      <p>{item?.product}</p>
                    </div>

                    <div className="price-detail">
                      <p>
                        ₹{item?.price} x {item?.pcs}pcs
                      </p>
                      <span>₹10,500.00</span>
                    </div>
                  </div>
                ))}
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

            <div className="bottom-btn">
              <button className="white-cta">Confirm Order</button>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    </div>
  );
}
