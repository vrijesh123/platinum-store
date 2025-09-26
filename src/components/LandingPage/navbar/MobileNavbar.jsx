import { Close } from "@mui/icons-material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

const MobileNavbar = ({ check, openSubMenu, toggleSubMenu }) => {
  return (
 <div className={check ? "active-mobile-menu mobile-menu" : "mobile-menu"}>
  <div className="menu-content">
    <ul>
      <Link href={"/"}>
        <li className="title">Home</li>
      </Link>
      <Link href={"/about-us"}>
        <li className="title">About Us</li>
      </Link>
      <li className="sub-menu" onClick={() => toggleSubMenu("more")}>
        <div className="menu-item">
          <p className="title">Resources</p>
          <div className="icon-container">
            {openSubMenu.more ? <Close /> : <AddIcon />}
          </div>
        </div>
        {openSubMenu.more && (
          <ul style={{ margin: "10px 0px 20px" }}>
            <Link href={"/faq"}><li>FAQ&apos;s</li></Link>
            <Link href={"/blogs"}><li>Blogs</li></Link>
            <Link href={"/contact-us"}><li>Contact Us</li></Link>
          </ul>
        )}
      </li>
    </ul>
  </div>

  {/* Buttons outside the scrollable menu list */}
  <div className="btns">
    <Link href={"/signup"}>
      <button className="sign-up-btn">Sign Up</button>
    </Link>
    <Link href={"/login"}>
      <button className="login-btn">Login</button>
    </Link>
  </div>
</div>


  );
};

export default MobileNavbar;
