import React from "react";
import GlobalForm from "./GlobalForm";
import { Button, createTheme } from "@mui/material";
import { contactApi } from "@/api/commonApi";
import { toast } from "react-toastify";

const form_json = [
  {
    type: "text",
    name: "first_name",
    label: "First Name",
    fullWidth: true,
    xs: 12,
    sm: 6,
    md: 6,
    lg: 6,
    validation_message: "Please enter first name",
    required: true,
  },
  {
    type: "text",
    name: "last_name",
    label: "Last Name",
    fullWidth: true,
    xs: 12,
    sm: 6,
    md: 6,
    lg: 6,
    validation_message: "Please enter last name",
    required: true,
  },

  {
    type: "email",
    name: "email_id",
    label: "Email Address",
    fullWidth: true,
    xs: 12,
    validation_message: "Please enter email",
    required: true,
  },

  {
    type: "tel",
    name: "phone_number",
    label: "Phone Number",
    fullWidth: true,
    xs: 12,
    validation_message: "Please enter phone number",
    required: true,
  },
  {
    type: "text",
    name: "message",
    label: "Message",
    fullWidth: true,
    multiline: true,
    rows: 3,
    xs: 12,
    validation_message: "Please enter message",
    required: true,
  },
];

const custom_theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          // This can apply to all base input styles, including select, etc.
          padding: 0,
          fontSize: "1rem",
          backgroundColor: "#FFF",
          color: "#5e5e5e",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          // For all select inputs
          backgroundColor: "#fafafa",
          borderRadius: "4px",
        },
        icon: {
          color: "#333",
        },
      },
    },
  },
});

const ContactUs = () => {
  const handleSubmit = async (values, resetForm) => {
    try {
      await contactApi.post("", values);
      toast.success("Your Enquiry has been recieved");
      resetForm();
    } catch (error) {
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <>
      <div className="contact-container">
        <div className="container">
          <div className="info-container">
            <div className="info">
              <p className="text-xs">Get In Touch</p>
              <h2>We are always ready to help you and answer your question</h2>

              <p className="text-sm">
                We’re here to help! Whether you have a question, need support,
                or want to explore how we can work together
              </p>

              <li>
                <p>
                  {" "}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5 1.5C10.3128 1.50258 8.21584 2.3726 6.66923 3.91922C5.12261 5.46584 4.25259 7.56276 4.25001 9.75C4.24739 11.5374 4.83124 13.2763 5.91201 14.7C5.91201 14.7 6.13701 14.9963 6.17376 15.039L12.5 22.5L18.8293 15.0353C18.8623 14.9955 19.088 14.7 19.088 14.7L19.0888 14.6978C20.169 13.2747 20.7526 11.5366 20.75 9.75C20.7474 7.56276 19.8774 5.46584 18.3308 3.91922C16.7842 2.3726 14.6873 1.50258 12.5 1.5ZM12.5 12.75C11.9067 12.75 11.3266 12.5741 10.8333 12.2444C10.34 11.9148 9.95543 11.4462 9.72837 10.8981C9.50131 10.3499 9.4419 9.74667 9.55765 9.16473C9.67341 8.58279 9.95913 8.04824 10.3787 7.62868C10.7982 7.20912 11.3328 6.9234 11.9147 6.80764C12.4967 6.69189 13.0999 6.7513 13.6481 6.97836C14.1962 7.20542 14.6648 7.58994 14.9944 8.08329C15.3241 8.57664 15.5 9.15666 15.5 9.75C15.499 10.5453 15.1826 11.3078 14.6202 11.8702C14.0578 12.4326 13.2954 12.749 12.5 12.75Z"
                      fill="white"
                    />
                  </svg>
                  Express Towers, Nariman Point, Marine Drive, Mumbai, MH 400021
                </p>
              </li>
              <li>
                <p>
                  {" "}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.0057 14.705C13.4086 15.1031 12.7151 15.3135 12 15.3135C11.285 15.3135 10.5914 15.1031 9.99431 14.705L0.159797 8.1485C0.105234 8.11213 0.0520781 8.0742 0 8.0352V18.7788C0 20.0106 0.999609 20.9882 2.20936 20.9882H21.7906C23.0224 20.9882 24 19.9886 24 18.7788V8.03516C23.9478 8.07425 23.8945 8.11227 23.8398 8.14869L14.0057 14.705Z"
                      fill="white"
                    />
                    <path
                      d="M0.939844 6.97697L10.7744 13.5336C11.1466 13.7818 11.5733 13.9058 12 13.9058C12.4267 13.9058 12.8534 13.7817 13.2256 13.5336L23.0602 6.97697C23.6487 6.58486 24 5.92861 24 5.22033C24 4.00247 23.0092 3.01172 21.7914 3.01172H2.20861C0.990797 3.01177 0 4.00252 0 5.2215C0 5.92861 0.351375 6.58486 0.939844 6.97697Z"
                      fill="white"
                    />
                  </svg>
                  contact@threatwatch360.com
                </p>
              </li>

              <iframe
                src={
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.3447793887935!2d72.82425049999999!3d18.9603748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce144756dabb%3A0xd58c28a51ab5f3cc!2sRubberwala%20The%20Platinum%20Mall!5e0!3m2!1sen!2sin!4v1735893815063!5m2!1sen!2sin"
                }
                loading="lazy"
              ></iframe>
            </div>
          </div>
          <div className="form-container">
            <div className="form">
              <h4>Get in touch</h4>

              <GlobalForm
                form_config={form_json}
                on_Submit={handleSubmit}
                btnClassName={"cta-btn"}
                btnText={"Save"}
                showSubmitBtn={false}
                custom_theme={custom_theme}
              >
                <div className="extra">
                  <Button type="submit" className="cta-btn">
                    Get Started
                  </Button>
                </div>
              </GlobalForm>
            </div>
          </div>
        </div>

        <div className="last-img">
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 1920 448"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#glowFilter)">
              <ellipse
                cx="960"
                cy="697"
                rx="960"
                ry="397"
                fill="url(#blueGradient)"
              />
            </g>
            <defs>
              <filter
                id="glowFilter"
                x="0"
                y="0"
                width="1920"
                height="1394"
                filterUnits="userSpaceOnUse"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="100"
                  result="effect1_foregroundBlur"
                />
              </filter>
              <linearGradient
                id="blueGradient"
                x1="960"
                y1="300"
                x2="960"
                y2="1094"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4285F4" stopOpacity="0.8" />
                <stop offset="1" stopColor="#4285F4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
