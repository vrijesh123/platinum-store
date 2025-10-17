import React, { useContext, useState } from "react";
import GlobalForm from "../global_components/GlobalForm";
import { AuthContext } from "@/context/AuthContext";

const LandingPage = () => {
  const { login } = useContext(AuthContext);

  const form_json = [
    {
      type: "email",
      name: "email",
      label: "Email",
      fullWidth: true,
      variant: "outlined",
      xs: 12,
      placeholder: "Enter your email",
      validation_message: "Please enter email",
      required: true,
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      fullWidth: true,
      variant: "outlined",
      show_password: true,
      xs: 12,
      placeholder: "Enter your password",
      validation_message: "Please enter password",
      required: true,
    },
  ];

  const handleSubmit = async (value, resetForm) => {
    const { email, password } = value;
    try {
      await login(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="landing-page-container">
      <div className="admin-login">
        <div className="left-container">
          <div className="form-container">
            <div className="form-heading">
              <h4>Welcome</h4>
              <p>Check stock, see prices & place orders quickly.</p>
            </div>
            <div className="form">
              <GlobalForm
                form_config={form_json}
                on_Submit={handleSubmit}
                btnClassName={"blue-cta"}
                btnText="Login"
                spacing={0}
              ></GlobalForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
