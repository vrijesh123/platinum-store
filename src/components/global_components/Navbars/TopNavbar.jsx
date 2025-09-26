import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

const TopNavbar = () => {
  const { user, permissions } = useContext(AuthContext);
  const [openNotification, setopenNotification] = useState(false);
  const notificationRef = useRef(null);

  const canViewNotification = permissions.includes("view_notification");

  // Close notification when clicking outsidea
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setopenNotification(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" top-nav-container">
      <div className="top-nav">
        <div className="profile">
          <div className="img-container">
            <img src="/vercel.svg" className="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
