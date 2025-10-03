import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Store = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Iphone", "Samsung Galaxy", "MI", "Huawei"];

  const products = [
    {
      name: "GX-IPHONE",
      price: 342,
      stock: 14,
    },
    {
      name: "GX-IPHONE",
      price: 342,
      stock: 14,
    },
    {
      name: "GX-IPHONE",
      is_active: false,
      stock: 14,
    },
    {
      name: "GX-IPHONE",
      price: 342,
      stock: 10,
    },
    {
      name: "GX-IPHONE",
      price: 342,
      stock: 14,
    },
    {
      name: "GX-IPHONE",
      price: 342,
      stock: 14,
    },
  ];

  return (
    <div className="container">
      <div className="store-heading">
        <div className="img-container">
          <img src="/logo/logo.png" alt="" />
        </div>
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
          {categories?.map((item, i) => (
            <div className="category" key={i}>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="products-container">
          <div className="left">
            <div className="products">
              {products?.map((item, i) => (
                <div className="product-store-widget" key={i}>
                  <div className="product">
                    <h6>{item?.name}</h6>
                    <p>iPhone • Excellent Brightness</p>

                    <div className="stock">
                      <p>In stock: {item?.stock} QTY</p>
                    </div>
                  </div>

                  <div className="actions">
                    <div className="price">
                      <p> ₹100.00</p>
                    </div>

                    <button className="blue-cta">Add Item</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right">
            <div className="desk-cart">
              <p>Selected Items</p>
              <ul>
                <li>iPhone 12 Pro Max</li>
                <li>iPhone 12 Pro Max</li>
                <li>iPhone 12 Pro Max</li>
                <li>iPhone 12 Pro Max</li>
              </ul>

              <button className="white-cta">View Cart</button>
            </div>
          </div>
        </div>

        <div className="mobile-cart">
          <div className="left">
            <p>Selected Items</p>
            <h6>5 Items</h6>
          </div>

          <div className="right">
            <button className="white-cta">View Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
