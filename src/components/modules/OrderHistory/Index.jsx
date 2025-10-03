import useMediaQuery from "@/hooks/useMediaQuery";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { SwipeableDrawer } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const OrderHistory = () => {
  const tenantAPI = useTenantAPI();
  const router = useRouter();
  const { id } = router.query;

  const is_mobile = useMediaQuery("(max-width: 900px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setopenDrawer] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setselectedOrder] = useState(null);

  const order_history = [
    {
      id: "#ORD1204",
      total: 10500,
      items: 50,
      created_at: new Date(),
    },
    {
      id: "#ORD1204",
      total: 15200,
      items: 20,
      created_at: new Date(),
    },
    {
      id: "#ORD1204",
      total: 8750,
      items: 5,
      created_at: new Date(),
    },
    {
      id: "#ORD1204",
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

  const fetchOrders = async () => {
    try {
      const res = await tenantAPI.get(
        `/admin/order/?user=${id}&page_size=1000`
      );

      if (res?.results?.length > 0) {
        const total = res?.results.reduce(
          (sum, item) => sum + parseFloat(item.total_price),
          0
        );
        const data = {
          ...res,
          total_order_amount: total,
        };

        setOrders(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchOrders();
  }, [tenantAPI, id]);

  console.log("Order History", selectedOrder);

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
            <span>{orders?.total_items}</span>
          </div>

          <div className="stat">
            <p>Total Order Amount</p>
            <span style={{ color: "#16A34A" }}>
              ₹{Number(orders?.total_order_amount).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="orders">
          {orders?.results?.map((item, i) => (
            <div className="order-widget" key={i}>
              <h6 className="line-clamp-1">#ORD{item?.id}</h6>

              <div className="order-details">
                <div className="detail">
                  <p className="price">₹{item?.total_price}</p>
                  <p>{item?.api_generate_invoice?.[0]?.items?.length} items</p>
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
                <p>{item?.status}</p>
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

export default OrderHistory;
