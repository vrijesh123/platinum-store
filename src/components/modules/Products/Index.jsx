import useMediaQuery from "@/hooks/useMediaQuery";
import { Edit, EyeIcon, PlusIcon } from "lucide-react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CircularProgress, SwipeableDrawer } from "@mui/material";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import GlobalForm from "@/components/global_components/GlobalForm";
import { useProductCategory } from "@/context/useCategory";

const Products = () => {
  const router = useRouter();
  const { tenantAPI } = useTenantAPI();
  const { categories } = useProductCategory();

  const is_mobile = useMediaQuery("(max-width: 900px)");
  const [searchTerm, setSearchTerm] = useState("");

  const [openDrawer, setopenDrawer] = useState(false);
  const [openEdit, setopenEdit] = useState(false);

  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef();

  // ✅ Fetch Products (Reusable)
  const fetchProducts = async (
    categoryId = "all",
    search = "",
    pageUrl = null,
    isLoadMore = false
  ) => {
    try {
      setLoading(true);
      let url = pageUrl || `/store-owner/product/?nested=True&depth=3&page=1`;

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

  // ✅ Initial fetch + category filter
  useEffect(() => {
    fetchProducts(selectedCategory, searchTerm);
  }, [tenantAPI, selectedCategory]);

  const hideProduct = async (item) => {
    try {
      await tenantAPI.patch(`/store-owner/product/?pk=${item?.id}`, {
        is_active: !item?.is_active,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    } catch (error) {}
  };

  const deleteProduct = async (id) => {
    try {
      await tenantAPI.delete(`/store-owner/product/?pk=${id}`);

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {}
  };

  const handleSubmit = async (value, resetForm) => {
    try {
      const res = await tenantAPI.post("/store-owner/product/", value);
      resetForm();
      fetchProducts(selectedCategory);
    } catch (error) {
      console.log(error);
    } finally {
      setopenDrawer(false);
    }
  };

  const handleEdit = async (value, resetForm) => {
    try {
      const res = await tenantAPI.patch(
        `/store-owner/product/?pk=${value?.id}`,
        value
      );

      const updatedProduct = res; // patched product from API

      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    } catch (error) {
      console.log(error);
    } finally {
      setopenEdit(false);
    }
  };

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

  const form_json = [
    {
      type: "select",
      name: "category",
      label: "Product Category",
      options: categories,
      fullWidth: true,
      variant: "outlined",
      xs: 12,
      validation_message: "Please enter category",
      required: true,
    },
    {
      type: "text",
      name: "name",
      label: "Model / Series",
      fullWidth: true,
      variant: "outlined",
      xs: 12,
      validation_message: "Please enter model / series",
      required: true,
    },

    {
      type: "text",
      name: "variant",
      label: "Variant",
      fullWidth: true,
      variant: "outlined",
      xs: 6,
      validation_message: "Please enter variant",
      required: true,
    },

    {
      type: "text",
      name: "quality",
      label: "Quality",
      fullWidth: true,
      variant: "outlined",
      xs: 6,
      validation_message: "Please enter quality",
      required: true,
    },
    {
      type: "number",
      name: "price",
      label: "Product Price (₹)",
      fullWidth: true,
      variant: "outlined",
      xs: 6,
      placeholder: "Enter your price",
      validation_message: "Please enter price",
      required: true,
    },
    {
      type: "number",
      name: "stock",
      label: "Product Qty",
      fullWidth: true,
      variant: "outlined",
      xs: 6,
      placeholder: "Enter your quantity",
      validation_message: "Please enter quantity",
      required: true,
    },
  ];

  return (
    <div className="container tenant-container">
      <div className="title">
        <h4>Products</h4>
      </div>

      <div className="products-container">
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
            Add Product
          </button>
        </div>

        <div className="products">
          <div className="categories">
            {/* All option */}
            <div
              className={`category ${
                selectedCategory === "all" ? "active" : ""
              }`}
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

          {products?.length > 0 ? (
            <div className="product-grid">
              {products?.map((item, i) => {
                const isLast = i === products.length - 1;
                return (
                  <div
                    className="product-widget"
                    key={item.id || i}
                    ref={isLast ? lastProductRef : null} // attach observer to last item
                  >
                    <div className="product">
                      <h6>{item?.name}</h6>
                      <p>
                        {item?.category?.name} • {item?.variant ?? "no variant"}{" "}
                        • {item?.quality ?? "no quality"}
                      </p>
                    </div>

                    <div className="details">
                      <p style={{ color: "#16A34A" }}>Price: ₹{item?.price}</p>
                      <p
                        style={{
                          color: item?.stock <= 10 ? "#D43131" : "#121212",
                        }}
                      >
                        Stock: {item?.stock} QTY
                      </p>
                      {item?.is_active ? (
                        <p style={{ color: "#2142FF" }}>Active</p>
                      ) : (
                        <p style={{ color: "#D43131" }}>Inactive</p>
                      )}
                    </div>

                    <div className="btns">
                      <button
                        className="white-cta"
                        onClick={() => {
                          const edit_data = {
                            id: item?.id,
                            category: item?.category?.id,
                            name: item?.name,
                            price: item?.price,
                            stock: item?.stock,
                            variant: item?.variant ?? "",
                            quality: item?.quality ?? "",
                          };
                          setEditProduct(edit_data);
                          setopenEdit(true);
                        }}
                      >
                        <Edit /> Edit
                      </button>

                      <button
                        className="black-cta"
                        onClick={() => hideProduct(item)}
                      >
                        <EyeIcon /> {item?.is_active ? "Hide" : "Show"}
                      </button>

                      <button
                        className="red-cta"
                        onClick={() => deleteProduct(item?.id)}
                      >
                        <DeleteOutlineIcon /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
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

          {/* Loader */}
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
          ></GlobalForm>
        </div>

        {/* <div className="bottom-btn">
          <button className="white-cta">Save</button>
        </div> */}
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
            editingValues={editProduct}
            on_Submit={handleEdit}
            btnClassName={"blue-cta"}
            spacing={1}
          ></GlobalForm>
        </div>

        {/* <div className="bottom-btn">
          <button className="white-cta">Save</button>
        </div> */}
      </SwipeableDrawer>
    </div>
  );
};

export default Products;
