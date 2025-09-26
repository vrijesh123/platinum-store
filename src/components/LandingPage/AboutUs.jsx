import React from "react";
import Image from "next/image";
import LandingWorkProcess from "../LandingPage/LandingWorkProcess";
import LandingGetinTouch from "../LandingPage/LandingGetinTouch";
import { useSiteSetting } from "@/context/useSiteSettings";

const AboutUs = () => {
  const { settings } = useSiteSetting();
  return (
    <>
      <div className="about-us-container container">
        <div className="about-blue">
          <svg
            width="484"
            height="967"
            viewBox="0 0 484 967"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_5_224)">
              <path
                d="M-150.223 -494.479L313.174 518.554L85.9698 230.057L-350.306 -358.479L-150.223 -494.479Z"
                fill="#2F81E9"
              />
            </g>
            <g filter="url(#filter1_f_5_224)">
              <path
                d="M-193.88 -216.842L269.518 796.191L42.3136 507.694L-393.962 -80.8418L-193.88 -216.842Z"
                fill="#2F81E9"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_5_224"
                x="-520.306"
                y="-664.479"
                width="1003.48"
                height="1353.03"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="85"
                  result="effect1_foregroundBlur_5_224"
                />
              </filter>
              <filter
                id="filter1_f_5_224"
                x="-563.962"
                y="-386.842"
                width="1003.48"
                height="1353.03"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="85"
                  result="effect1_foregroundBlur_5_224"
                />
              </filter>
            </defs>
          </svg>
        </div>

        <div className="about-content">
          <h2>About Us</h2>
          <p dangerouslySetInnerHTML={{ __html: settings?.about_us }} />
        </div>

        <section className="mission-vision-section container ">
          <div className="block">
            <div className="image-container">
              <Image
                src="/images/about1.png" // Replace with your actual image path
                alt="Team working together"
                width={600}
                height={300}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="text-content">
              <h2>Our Mission</h2>
              <p dangerouslySetInnerHTML={{ __html: settings?.mission }} />
            </div>
          </div>

          <div className="block">
            <div className="text-content">
              <h2>Our Vision</h2>
              <p dangerouslySetInnerHTML={{ __html: settings?.vision }} />
            </div>
            <div className="image-container">
              <Image
                src="/images/about2.png" // Replace with your actual image path
                alt="Team discussion"
                width={600}
                height={300}
                className="image"
              />
            </div>
          </div>
        </section>

        <LandingWorkProcess />
      </div>

      <LandingGetinTouch />
    </>
  );
};

export default AboutUs;
