import { forgotPasswordAPI } from "@/api/adminApi";
import GlobalForm from "@/components/global_components/GlobalForm";
import React, { useState } from "react";
import { toast } from "react-toastify";

const contact_form_json = [
  {
    type: "email",
    name: "email",
    label: "Email",
    fullWidth: true,
    variant: "outlined",
    xs: 12,
    validation_message: "Please enter your Email",
    required: true,
  },
];

const Index = () => {
  const [submitting, setsubmitting] = useState(false);

  const handleSubmit = async (value, resetForm) => {
    setsubmitting(true);
    try {
      const res = await forgotPasswordAPI.post("", {
        email: value?.email,
      });

      toast.success(res?.message);
    } catch (error) {
    } finally {
      setsubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-container">
        <div className="logo-container">
          <img src="/logo/logo.png" alt="" />
        </div>

        <div className="form-container">
          <h4>Send Email</h4>
          <div className="form">
            <GlobalForm
              form_config={contact_form_json}
              on_Submit={handleSubmit}
              btnClassName={"blue-cta"}
              btnText="Send Reset Link"
              spacing={1}
              is_submitting={submitting}
            ></GlobalForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
