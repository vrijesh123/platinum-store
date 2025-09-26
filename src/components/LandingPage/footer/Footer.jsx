import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathName = usePathname();

  return (
    <section
      className="landing-footer-container"
      style={{ marginTop: pathName == "/contact-us" && 0 }}
    >
      <div className="container">
        <div className="footer">
          <div className="footer-left">
            <div className="footer-logo">
              <img src="/logo/logo.png" alt="Logo" />
              {/* <p>
                Powered By <strong>THREATWATCH360</strong>
              </p> */}
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-group">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact Us</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
              </ul>
            </div>
            <div className="footer-group">
              <h4>Resources</h4>
              <ul>
                <li>
                  <Link href="/blogs">Blogs</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
              </ul>
            </div>
            <div className="footer-group">
              <h4>More services</h4>
              <ul>
                <li>
                  <a href="/solution/anti-phishing">
                    Anti-phishing: PhishBlocker
                  </a>
                </li>
                <li>
                  <a href="/solution/anti-rogue">Anti-rogue: RogueWatch</a>
                </li>
                <li>
                  <a href="/solution/breacheye">
                    Business Email Breach: BreachEye
                  </a>
                </li>
                <li>
                  <a href="/solution/takedowns">Takedown as Service</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-subscribe">
            <h4>Let&apos;s keep in Touch</h4>
            <p>
              Enter your email to keep in the know with the latest updates from
              CheckYourCreds.
            </p>
            <input type="email" placeholder="your@email.com" />
            <button>Submit</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms of Service</Link>
        </div>
      </div>
    </section>
  );
};

export default Footer;
