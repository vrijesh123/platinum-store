import { ChevronRight, East } from "@mui/icons-material";
import { Box, SwipeableDrawer } from "@mui/material";
import React, { useEffect, useRef } from "react";

const Drawer = ({ open, setOpen, icon, title, children }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const menu = drawerRef.current;
    if (!menu) return;

    // Handle wheel events to stop propagation
    const handleWheel = (event) => {
      event.stopPropagation();
    };

    // Add event listener with passive: false to allow stopping propagation
    menu.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup the event listener on unmount
    return () => {
      menu.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <SwipeableDrawer
      ref={drawerRef}
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      PaperProps={{
        sx: { width: { lg: "40vw", md: "50vw", xs: "100vw" } }, // Set width here
      }}
    >
      <Box role="presentation">
        <div className="drawer-container">
          <div className="drawer-header">
            <div>
              <div className="icon-container">
                <img src={icon} alt="icon" />
              </div>

              <p>{title}</p>
            </div>

            <button className="white-cta" onClick={() => setOpen(false)}>
              Back <East sx={{ fontSize: 20 }} />
            </button>
          </div>

          <div className="drawer-content">{children}</div>
        </div>
      </Box>
    </SwipeableDrawer>
  );
};

export default Drawer;
