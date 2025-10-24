import { AuthContext } from "@/context/AuthContext";
import { useProductCategory } from "@/context/useCategory";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const Store = () => {
  const router = useRouter();
  const { tenantAPI } = useTenantAPI();
  const { categories } = useProductCategory();
  const { clientLogout } = useContext(AuthContext);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setopenDrawer] = useState(false);
  const [products, setProducts] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState([]);
  const [cart_items, setCart_items] = useState([]);

  const observerRef = useRef();

  const fetchProducts = async (
    categoryId = "all",
    search = "",
    pageUrl = null,
    isLoadMore = false
  ) => {
    try {
      setLoading(true);
      let url = pageUrl || `/client/product/?nested=True&depth=3&page=1`;

      if (categoryId && categoryId !== "all") url += `&category=${categoryId}`;
      if (search) url += `&name=${encodeURIComponent(search)}`;

      const res = await tenantAPI.get(url);

      const newProducts = res?.results || [];

      // merge for infinite scroll
      setProducts((prev) =>
        isLoadMore ? [...prev, ...newProducts] : newProducts
      );

      // store next page link
      setNextPageUrl(res?.links?.next);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

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
      setCart_items(res?.results || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCartItems();
  }, [tenantAPI]);

  const addCartItem = async (product, quantity = 1) => {
    try {
      const res = await tenantAPI.post(`/client/cart-item/`, {
        cart: cart?.id,
        product: product?.id,
        price: product?.price,
        quantity: quantity,
      });

      fetchCartItems(); // refresh cart items
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeCartItem = async (cart) => {
    try {
      const res = await tenantAPI.delete(`/client/cart-item/?pk=${cart?.id}`);
      fetchCartItems(); // refresh cart
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // ✅ Initial fetch + category filter
  useEffect(() => {
    fetchProducts(selectedCategory, searchTerm);
  }, [tenantAPI, selectedCategory]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchProducts(selectedCategory, term);
  };

  // ✅ Infinite Scroll (Intersection Observer)
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageUrl) {
          fetchProducts(selectedCategory, searchTerm, nextPageUrl, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, nextPageUrl, selectedCategory, searchTerm]
  );

  console.log("store", cart_items);

  return (
    <div className="container">
      <div className="store-heading">
        <div className="img-container">
          <img src="/logo/logo.png" alt="" />
        </div>

        <button className="red-cta" onClick={clientLogout}>
          Logout
        </button>
      </div>

      <div className="store-container">
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

        <div className="categories">
          {/* All option */}
          <div
            className={`category ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            <p>All</p>
          </div>

          {/* Other categories */}
          {categories?.map((item, i) => (
            <div
              className={`category ${
                selectedCategory === item.id ? "active" : ""
              }`}
              key={i}
              onClick={() => setSelectedCategory(item.id)}
            >
              <p>{item?.name}</p>
            </div>
          ))}
        </div>

        <div className="products-container">
          <div className="left">
            {products?.length > 0 ? (
              <div className="products">
                {products?.map((item, i) => {
                  const isLast = i === products.length - 1;
                  const in_cart = cart_items?.find(
                    (ci) => ci?.product?.id === item.id
                  );

                  return (
                    <div
                      className="product-store-widget"
                      key={i}
                      ref={isLast ? lastProductRef : null}
                    >
                      <div className="product">
                        <h6>{item?.name}</h6>
                        <p>
                          {item?.category?.name} •{" "}
                          {item?.variant ?? "no variant"} •{" "}
                          {item?.quality ?? "no quality"}
                        </p>

                        <div className="stock">
                          <p>In stock: {item?.stock} QTY</p>
                        </div>
                      </div>

                      <div className="actions">
                        <div className="price">
                          <p> ₹{item?.price}</p>
                        </div>

                        {in_cart ? (
                          <button
                            className="red-cta"
                            onClick={() => removeCartItem(in_cart, 1)}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className="blue-cta"
                            onClick={() => addCartItem(item, 1)}
                          >
                            Add Item
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                  >
                    <CircularProgress />
                  </p>
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
                No Products Found
              </p>
            )}
          </div>

          <div className="right">
            {cart_items?.length > 0 && (
              <div className="desk-cart">
                <p>Selected Items</p>
                <ul>
                  {cart_items?.map((item, i) => (
                    <li key={item?.id}>{item?.product?.name}</li>
                  ))}
                </ul>
                <Link href={"/tenant/cart"}>
                  <button className="white-cta">View Cart</button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {cart_items?.length > 0 && (
          <div className="mobile-cart">
            <div className="left">
              <p>Selected Items</p>
              <h6>{cart_items?.length} Items</h6>
            </div>

            <div className="right">
              <Link href={"/tenant/cart"}>
                <button className="white-cta">View Cart</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
