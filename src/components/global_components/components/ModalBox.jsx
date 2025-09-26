import React from "react";
import { Modal, Box } from "@mui/material";
import { Close } from "@mui/icons-material";

const ModalBox = ({ open, setOpen, icon, title, children }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          width: { xl: "40vw", lg: "50vw", md: "50vw", xs: "90vw" },
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="modal-container">
          <div className="modal-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {icon && (
                <div className="icon-container">
                  <img
                    src={icon}
                    alt="icon"
                    style={{ width: 24, height: 24 }}
                  />
                </div>
              )}
              <p>{title}</p>
            </div>

            <button onClick={() => setOpen(false)}>
              <Close />
            </button>
          </div>

          <div className="modal-content">{children}</div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalBox;
