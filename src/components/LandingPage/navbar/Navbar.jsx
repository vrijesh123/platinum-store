import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MobileNavbar from "./MobileNavbar";
import Link from "next/link";

const Navbar = () => {
  // Refs for audio and navigation container
  const navContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuItemsRef = useRef([]);
  menuItemsRef.current = [];

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState({}); // State to manage which submenu is open

  const handleClick = () => {
    setCheck((prevCheck) => !prevCheck);
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenu((prevMenu) => ({
      ...prevMenu,
      [menu]: !prevMenu[menu],
    }));
  };

  const [showProcedure, setShowProcedure] = useState(false);
  const [showSymptom, setShowSymptom] = useState(false);
  const [showResource, setShowResource] = useState(false);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY && !check) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY && !check) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // Toggle Mobile Menu with Animation
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "100%", y: "-100%", opacity: 0 },
        {
          x: "0%",
          y: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        menuItemsRef.current,
        {
          opacity: 0,
          transform:
            "translate3d(10px, 1px, -60px) rotateY(-60deg) rotateX(-40deg)",
          transformOrigin: "50% 50% -150px",
        },
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.3,
        delay: 0.1,
        ease: "power3.in",
      });

      gsap.to(menuItemsRef.current, {
        opacity: 1,
        transform:
          "translate3d(10px, 1px, -60px) rotateY(-60deg) rotateX(40deg)",
        transformOrigin: "50% 50% 150px",
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const navHeight =
        document.querySelector(".nav-header")?.offsetHeight || 100;
      document.querySelector("main").style.paddingTop = `${navHeight}px`;
    }
  }, []);

  return (
    <nav className={`nav-container ${check ? "active" : ""}`}>
      <header className="nav-header" ref={navContainerRef}>
        <nav className="nav-inner container">
          {/* <!-- Logo and Product Button --> */}
          <div className="logo-container">
            <Link href={"/"}>
              <img src="/logo/logo.png" alt="logo" className="logo" />
            </Link>
          </div>

          {/* <!-- Navigation Links --> */}
          <div className="nav-links-container">
            <div className="nav-links">
              {/* <!-- Replace `navItems` with actual nav items --> */}
              <Link href={"/"} className="nav-link">
                Home
              </Link>
              <Link href={"/pricing"}>Pricing</Link>

              <div
                className="nav-item"
                onMouseEnter={() => setShowResource(true)}
                onMouseLeave={() => setShowResource(false)}
              >
                <div className="categories-dropdown">
                  Resources
                  {showResource ? <ExpandLess /> : <ExpandMore />}
                </div>
                {showResource && (
                  <ul
                    className="dropdown-menu"
                    style={{
                      gridTemplateColumns: "repeat(1, 1fr)",
                      width: "140px",
                      left: 0,
                    }}
                  >
                    <Link href={"/faq"}>
                      <li>FAQ&apos;s</li>
                    </Link>
                    <Link href={"/blogs"}>
                      <li>Blogs</li>
                    </Link>
                    <Link href={"/about-us"}>
                      <li>About Us</li>
                    </Link>
                    <Link href={"/contact-us"}>Contact Us</Link>
                  </ul>
                )}
              </div>

              <div className="btns">
                <Link href={"/signup"}>
                  <button className="SignUp-btn">Sign Up</button>
                </Link>
                <Link href={"/login"}>
                  <button className="login-btn">Login</button>
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`${check ? "active-nav" : ""} hamburger`}
            onClick={handleClick}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </header>

      <MobileNavbar
        check={check}
        toggleSubMenu={toggleSubMenu}
        openSubMenu={openSubMenu}
      />
    </nav>
  );
};

export default Navbar;
