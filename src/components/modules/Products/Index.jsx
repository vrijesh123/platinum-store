import useMediaQuery from "@/hooks/useMediaQuery";
import { Edit, EyeIcon, PlusIcon } from "lucide-react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SwipeableDrawer } from "@mui/material";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import GlobalForm from "@/components/global_components/GlobalForm";
import { useProductCategory } from "@/context/useCategory";

const Products = () => {
  const router = useRouter();
  const tenantAPI = useTenantAPI();
  const { categories } = useProductCategory();

  const is_mobile = useMediaQuery("(max-width: 900px)");
  const [searchTerm, setSearchTerm] = useState("");

  const [openDrawer, setopenDrawer] = useState(false);
  const [openEdit, setopenEdit] = useState(false);

  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchProducts = async (categoryId) => {
    try {
      let url = `/admin/product/?page_size=1000&nested=True&depth=3`;
      if (categoryId && categoryId !== "all") {
        url += `&category=${categoryId}`;
      }

      const res = await tenantAPI.get(url);

      if (res?.results?.length > 0) {
        setProducts(res?.results);
      } else {
        setProducts([]); // no products found
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [tenantAPI, selectedCategory]);

  const hideProduct = async (id) => {
    try {
      await tenantAPI.patch(`/admin/product/?pk=${id}`, {
        is_active: true,
      });
    } catch (error) {}
  };

  const deleteProduct = async (id) => {
    try {
      await tenantAPI.delete(`/admin/product/?pk=${id}`);

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {}
  };

  const handleSubmit = async (value, resetForm) => {
    try {
      const res = await tenantAPI.post("/admin/product/", value);
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
        `/admin/product/?pk=${value?.id}`,
        value
      );

      console.log("first", res);

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
      label: "Product name",
      fullWidth: true,
      variant: "outlined",
      xs: 12,
      validation_message: "Please enter name",
      required: true,
    },
    {
      type: "number",
      name: "price",
      label: "Price",
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
      label: "Stock",
      fullWidth: true,
      variant: "outlined",
      xs: 6,
      placeholder: "Enter your stock",
      validation_message: "Please enter stock",
      required: true,
    },
  ];

  console.log("Products", editProduct);

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

          <div className="product-grid">
            {products?.map((item, i) => (
              <div className="product-widget" key={i}>
                <div className="product">
                  <h6>{item?.name}</h6>
                  <p>OLED IC • 16 PLUS</p>
                </div>

                <div className="details">
                  <p style={{ color: "#16A34A" }}>Price: ₹{item?.price} </p>
                  <p
                    style={{ color: item?.stock <= 10 ? "#D43131" : "#121212" }}
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
                      };

                      setEditProduct(edit_data);
                      setopenEdit(true);
                    }}
                  >
                    <Edit /> Edit
                  </button>

                  <button
                    className="black-cta"
                    onClick={() => hideProduct(item?.id)}
                  >
                    <EyeIcon /> Hide
                  </button>

                  <button
                    className="red-cta"
                    onClick={() => deleteProduct(item?.id)}
                  >
                    <DeleteOutlineIcon /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
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
