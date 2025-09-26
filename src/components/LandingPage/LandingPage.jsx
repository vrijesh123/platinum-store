import { DomainCheckAPI } from "@/api/loginAPI";
import React, { useState } from "react";
import { toast } from "react-toastify";

const LandingPage = () => {
  const [subDomain, setsubDomain] = useState(null);

  const check_subdomain = async () => {
    try {
      const res = await DomainCheckAPI.get(
        `?sub_domain=${subDomain}.apexodr-uat.com`
      );

      // Assuming your API returns { status: "success" } in res.data
      if (res?.status === "success") {
        window.location.href = `http://${subDomain}.localhost:3000/login`; // or your prod domain
      } else {
        toast.error("Domain not found");
      }
    } catch (error) {
      console.error("Failed To verify the Domain", error);
      toast.error("Domain not found");
    }
  };

  return (
    <div className="landing-page-container">
      <div className="container">
        <h1>Welcome To APEX ODR</h1>

        <div className="form">
          <label htmlFor="">Enter Subdomain</label>
          <input
            type="text"
            value={subDomain}
            onChange={(e) => setsubDomain(e.target.value)}
          />
          <button className="black-cta" onClick={check_subdomain}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
