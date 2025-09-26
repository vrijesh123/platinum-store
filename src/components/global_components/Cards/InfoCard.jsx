import React from "react";

const InfoCard = ({ title, value, icon }) => {
  return (
    <div className="info-card">
      <div className="info-card-header">
        <div className="icon-container">
          <img src={icon} alt={`${title} icon`} />
        </div>
        <h3 className="info-card-title">{title}</h3>
      </div>
      <p className="info-card-value">{value}</p>
    </div>
  );
};

export default InfoCard;
