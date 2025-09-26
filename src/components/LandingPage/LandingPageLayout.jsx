import React from "react";
import LandingFooter from "./footer/Footer";
import Navbar from "./navbar/Navbar";

const LandingPageLayout = ({ children }) => {
  //   const children = React.Children.map(children, (child) => {
  //     if (React.isValidElement(child)) {
  //       return React.cloneElement(child);
  //     }
  //     return child;
  //   });

  return (
    <>
      <Navbar />

      <main>{children}</main>

      <LandingFooter />
    </>
  );
};

export default LandingPageLayout;
