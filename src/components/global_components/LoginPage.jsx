import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GlobalForm from "./GlobalForm";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import styled from "@emotion/styled";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [agree, setAgree] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);

  const form_json = [
    {
      type: "text",
      name: "username",
      label: "Username",
      placeholder: "Enter your username",
      fullWidth: true,
      xs: 12,
      validation_message: "Please enter username",
      required: true,
      variant: "outlined",
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      placeholder: "Enter Password",
      fullWidth: true,
      show_password: true,
      xs: 12,
      validation_message: "Please enter password",
      required: true,
      variant: "outlined",
    },
  ];

  const handleSubmit = async (values, resetForm) => {
    if (!agree) {
      setCheckboxError(true);
      return;
    }
    try {
      const { username, password } = values;

      await login(username, password);
      resetForm();
      setAgree(false);
      setCheckboxError(false);
    } catch (error) {
      console.error(error);
    }
  };

  const googleLogin = async () => {
    router.push(
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=587032720364-7q3gfn5sfqdi7uhtk84obvs3f562m3mt.apps.googleusercontent.com&redirect_uri=http://localhost:3000/google-auth/&response_type=code&scope=openid%20email%20profile&access_type=online&include_granted_scopes=true&prompt=consent&state={STATE}"
    );
  };

  const githubLogin = async () => {
    router.push(
      "https://github.com/login/oauth/authorize?client_id=Ov23liLLQT74aer2XYT1&redirect_uri=http://localhost:3000/github-auth&scope=user:email&state=XYZ123"
    );
  };

  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    "&.Mui-checked": {
      color: "#2F81E9 !important",
    },
  }));

  return (
    <div className="login-container">
      <div className="login-left">
        <Image
          src="/images/login-image.png"
          alt="Login visual"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="overlay">
          <Link href="/" className="back-link">
            <button className="back-button">
              <svg
                width="28"
                height="16"
                viewBox="0 0 28 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27 9C27.5523 9 28 8.55228 28 8C28 7.44772 27.5523 7 27 7L27 9ZM0.292894 7.29289C-0.0976295 7.68342 -0.0976296 8.31658 0.292894 8.7071L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41422 8L8.07107 2.34314C8.46159 1.95262 8.46159 1.31945 8.07107 0.928931C7.68054 0.538406 7.04738 0.538406 6.65686 0.92893L0.292894 7.29289ZM27 7L1 7L1 9L27 9L27 7Z"
                  fill="#141414"
                />
              </svg>
              Back
            </button>
          </Link>
        </div>
        <div className="login-text">
          <h1>Welcome Back!</h1>
          <p>
            Log in to stay protected and keep your credentials secure with
            CredCheck.
          </p>
        </div>
      </div>

      <div className="login-right">
        <Link href="/" className="back-link-2">
          <button className="back-button-2">
            <svg
              width="28"
              height="16"
              viewBox="0 0 28 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27 9C27.5523 9 28 8.55228 28 8C28 7.44772 27.5523 7 27 7L27 9ZM0.292894 7.29289C-0.0976295 7.68342 -0.0976296 8.31658 0.292894 8.7071L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41422 8L8.07107 2.34314C8.46159 1.95262 8.46159 1.31945 8.07107 0.928931C7.68054 0.538406 7.04738 0.538406 6.65686 0.92893L0.292894 7.29289ZM27 7L1 7L1 9L27 9L27 7Z"
                fill="white"
              />
            </svg>
            Back
          </button>
        </Link>
        <div className="login-form-container">
          <h2>Log In</h2>
          <GlobalForm
            form_config={form_json}
            on_Submit={handleSubmit}
            btnClassName={"cta-btn"}
            showSubmitBtn={false} // hide default submit
          >
            <div className="extra">
              <div className="terms">
                <FormControlLabel
                  control={
                    <CustomCheckbox
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />
                  }
                  label={"I agree to the terms & policy "}
                />
                {checkboxError && (
                  <FormHelperText error>
                    Please accept the terms & policy to continue.
                  </FormHelperText>
                )}
                <Link href="/forgot-password">
                  <span className="forgot-password">Forget Password?</span>
                </Link>
              </div>

              {/* Submit through this button */}
              <div className="login-page-btn">
                <button type="submit">Log in</button>
              </div>

              <div className="or-divider">OR</div>

              <div className="after-text">
                Don’t have an account?{" "}
                <Link href="/signup">
                  <span className="signup-link">Sign Up</span>
                </Link>
              </div>
            </div>
          </GlobalForm>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
