import { forgotPasswordAPI, PasswordResetAPI } from "@/api/adminApi";
import GlobalForm from "@/components/global_components/GlobalForm";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

const contact_form_json = [
  {
    type: "password",
    name: "new_password",
    label: "New Password",
    fullWidth: true,
    variant: "outlined",
    show_password: true,
    xs: 12,
    placeholder: "Enter your password",
    validation_message: "Please enter password",
    required: true,
  },

  {
    type: "password",
    name: "confirm_password",
    label: "Confirm Password",
    fullWidth: true,
    variant: "outlined",
    show_password: true,
    xs: 12,
    placeholder: "Enter your password",
    validation_message: "Please enter password",
    required: true,
  },
];

const Index = () => {
  const router = useRouter();
  const [submitting, setsubmitting] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const uid = params.get("uid");
  const token = params.get("token");

  const handleSubmit = async (value, resetForm) => {
    setsubmitting(true);
    const { new_password, confirm_password } = value;

    if (new_password !== confirm_password) {
      toast.error("Password does not match");
      return;
    }

    try {
      const res = await PasswordResetAPI.post("", {
        new_password: value?.new_password,
        uid,
        token,
      });

      toast.success(res?.message ?? "Password has been changed!");
      router.push("/");
    } catch (error) {
    } finally {
      setsubmitting(false);
    }
  };

  if (!uid || !token) {
    toast.error("No UID or Token found");
    router.back();
    return;
  }

  return (
    <div className="login-container">
      <div className="left-container">
        <div className="logo-container">
          <img src="/logo/logo.png" alt="" />
        </div>

        <div className="form-container">
          <h4>Reset Password</h4>
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
