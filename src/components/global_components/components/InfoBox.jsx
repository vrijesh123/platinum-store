import { Tooltip } from "@mui/material";
import React from "react";

const InfoBox = ({ title = "", placement = "top" }) => {
  return (
    <Tooltip
      arrow
      placement={placement}
      title={title}
      sx={{ textAlign: "center" }}
    >
      <div className="icon-container">
        <img src="/icons/info-circle.svg" alt="info" />
      </div>
    </Tooltip>
  );
};

export default InfoBox;
