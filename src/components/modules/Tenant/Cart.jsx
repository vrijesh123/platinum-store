import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Close, Remove, West } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Cart = () => {
  const router = useRouter();
  const { tenantAPI } = useTenantAPI();
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showSummary, setshowSummary] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await tenantAPI.get(`/client/cart/`);
      setCart(res?.results[0] || null);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [tenantAPI]);

  const fetchCartItems = async () => {
    try {
      const res = await tenantAPI.get(`/client/cart-item/?depth=3&nested=True`);
      setCartItems(res?.results || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCartItems();
  }, [tenantAPI]);

  const removeCartItem = async (cart) => {
    try {
      const res = await tenantAPI.delete(`/client/cart-item/?pk=${cart?.id}`);
      fetchCartItems(); // refresh cart
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateCartQuantity = async (cartId, newQty) => {
    try {
      await tenantAPI.patch(`/client/cart-item/?pk=${cartId}`, {
        quantity: newQty,
      });
      // fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleQuantityChange = (cartId, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );

    const updatedItem = cartItems.find((item) => item.id === cartId);
    const newQty = Math.max(1, (updatedItem?.quantity || 1) + delta);
    updateCartQuantity(cartId, newQty);
  };

  const handleQuantityInput = (cartId, value) => {
    if (value === "") {
      // allow temporary empty input
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: "" } : item
        )
      );
      return;
    }

    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: numericValue } : item
        )
      );
    }
  };

  const handleQuantityBlur = (cartId, value, maxStock) => {
    let finalQty = parseInt(value, 10);
    if (isNaN(finalQty) || finalQty < 1) finalQty = 1;
    if (maxStock && finalQty > maxStock) finalQty = maxStock;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartId ? { ...item, quantity: finalQty } : item
      )
    );

    updateCartQuantity(cartId, finalQty);
  };

  const place_order = async () => {
    try {
      const order = {
        user: cart?.user,
        cart: cart?.id,
        total_price: totalPrice,
      };

      const res = await tenantAPI.post(`/client/order/`, order);
      console.log("Order placed:", res);
      if (res) {
        cartItems.forEach(async (item) => {
          // Reduce stock of each product
          try {
            await tenantAPI.post(`/client/order-item/`, {
              product: item?.product?.id,
              quantity: item?.quantity,
              price: item?.price,
              order: res?.id,
            });
          } catch (error) {
            console.error("Error updating product stock:", error);
          }

          // Remove item from cart
          try {
            await tenantAPI.delete(`/client/cart-item/?pk=${item?.id}`);
          } catch (error) {
            console.error("Error removing cart item:", error);
          }
        });
      }

      setshowSummary(false);
      toast.success("Order placed successfully!");
      router.back();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order" + error.message);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <div className="cart-container">
        <div className="cart-heading">
          <p>My Cart</p>

          <div className="back" onClick={() => history.back()}>
            <West />
            Back
          </div>
        </div>

        <div className="container">
          {cartItems?.length > 0 ? (
            <div className="cart-items">
              {cartItems?.map((item, i) => {
                return (
                  <div className="cart-widget" key={i}>
                    <div className="cart-details">
                      <p>{item?.product?.name}</p>
                      <span>
                        {item?.product?.category?.name} •{" "}
                        {item?.product?.variant} • {item?.product?.quality}
                      </span>
                      <div className="stock">
                        In stock: {item?.product?.stock} QTY{" "}
                      </div>
                    </div>

                    <div
                      className="delete-btn"
                      onClick={() => removeCartItem(item)}
                    >
                      <img src="/icons/trash.svg" alt="" />
                    </div>

                    <div className="cart-quantity">
                      <div className="price">
                        <p>₹ {Number(item?.price).toLocaleString()}</p>
                      </div>

                      <div className="qty">
                        <button
                          className="red-cta"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Remove />
                        </button>
                        <input
                          type="text"
                          value={item?.quantity}
                          onChange={(e) =>
                            handleQuantityInput(item.id, e.target.value)
                          }
                          onBlur={(e) =>
                            handleQuantityBlur(
                              item.id,
                              e.target.value,
                              item?.product?.stock
                            )
                          }
                        />
                        <button
                          className="blue-cta"
                          onClick={() => handleQuantityChange(item.id, +1)}
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                height: "85vh",
                fontSize: "16px",
                fontWeight: "400",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No item in cart
            </p>
          )}

          {cartItems?.length > 0 && (
            <div className="bottom-btn">
              <div className="total">
                <p>Total Order</p>
                <p>₹{totalPrice.toLocaleString()}</p>
              </div>
              <button
                className="white-cta"
                onClick={() => setshowSummary(true)}
              >
                Place Order
              </button>
            </div>
          )}
        </div>

        <Dialog
          open={showSummary}
          onClose={() => setshowSummary(false)}
          PaperProps={{
            sx: {
              borderRadius: "5px",
              p: 2,
              width: { lg: "500px", xs: "100%" },
            },
          }}
          className="summary-dialog"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <DialogTitle sx={{ fontWeight: 600, p: 0 }}>
              My Cart Summary
            </DialogTitle>
            <IconButton onClick={() => setshowSummary(false)}>
              <Close />
            </IconButton>
          </Box>

          <DialogContent sx={{ mt: 1, p: 0 }}>
            <div className="dialog-items">
              {cartItems?.map((item, i) => (
                <div className="item" key={i}>
                  <div className="details">
                    <p>{item?.product?.name}</p>
                    <span>
                      {item?.product?.category?.name} • {item?.product?.variant}{" "}
                      • {item?.product?.quality}
                    </span>
                  </div>

                  <div className="price">
                    <span>
                       ₹{item?.product?.price} x {item?.quantity}
                    </span>
                    <p> ₹{item?.product?.price * item?.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="total">
              <div>
                <p>Total Items</p>
                <strong>{cartItems?.length}</strong>
              </div>
              <div>
                <p>Total Quantity</p>
                <strong>{totalQuantity}</strong>
              </div>

              <div className="total-price">
                <p>Total Price</p>
                <strong>₹{totalPrice.toLocaleString()}</strong>
              </div>
            </div>
          </DialogContent>

          <DialogActions sx={{ mt: 2, p: 0 }}>
            <button
              className="blue-cta"
              style={{ width: "100%" }}
              onClick={place_order}
            >
              Place Order
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Cart;
