import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { menuConfig } from "@/configs/menuConfigs";
import { usePathname } from "next/navigation";

const SideNav = () => {
  const { user, permissions, logout } = useContext(AuthContext);
  const pathName = usePathname();

  // Get the menu items for the user's role
  const menuItems = menuConfig["Admin"] || [];

  // Helper to check if user has a permission
  const hasPermission = (perm) => {
    if (!perm) return true; // if no permission is required, it's allowed
    return permissions.includes(perm);
  };

  // State to control side menu visibility
  const [isSideMenuOpen, setSideMenuOpen] = useState(true);

  // Function to adjust main tag margin as per side-nav width
  const adjustMainMargin = useCallback(() => {
    const sideMenu = document.querySelector(".side-menu");
    const main = document.querySelector("main");

    const sideMenuWidth = sideMenu.offsetWidth;
    main.style.marginLeft = sideMenuWidth + 20 + "px";
  }, [isSideMenuOpen]);

  const handleDetailsToggle = (details) => {
    const content = details.querySelector("ul");
    if (details.open) {
      const height = content.scrollHeight;
      content.style.height = height + "px";
      setTimeout(() => {
        content.style.height = "auto"; // Set height to auto after animation
      }, 300); // Match this time with transition duration
    } else {
      content.style.height = content.scrollHeight + "px"; // Start from the full height
      setTimeout(() => {
        content.style.height = "0px"; // Transition to 0 height
      }, 0);
    }
  };

  useEffect(() => {
    // adjustMainMargin();
    // window.addEventListener("resize", adjustMainMargin);

    document.querySelectorAll("details").forEach((details) => {
      // Add initial class for content
      const content = details.querySelector("ul");
      content.classList.add("details-content");

      details.addEventListener("toggle", () => handleDetailsToggle(details));
    });

    const currentUrl = new URL(window.location.href);
    if (Cookies.get("url_visited") === undefined) {
      Cookies.set("url_visited", currentUrl);
    } else {
      const urlVisited = Cookies.get("url_visited").split("|");
      if (urlVisited[urlVisited.length - 1] !== currentUrl.toString()) {
        Cookies.set(
          "url_visited",
          Cookies.get("url_visited") + "|" + currentUrl
        );
      }
    }

    // return () => {
    //   window.removeEventListener("resize", adjustMainMargin);
    // };
  }, []);

  const menuRef = useRef(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    // Handle wheel events to stop propagation
    const handleWheel = (event) => {
      event.stopPropagation();
    };

    // Add event listener with passive: false to allow stopping propagation
    menu.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup the event listener on unmount
    return () => {
      menu.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      {/* Main Menu */}
      <div className={`side-menu ${isSideMenuOpen && "active"}`}>
        <div className="logo-container">
          <img src="/logo/logo.png" className="logo" />
        </div>

        <ul ref={menuRef} className="menu">
          {menuItems.map((item, index) => {
            // Check if this main item has a requiredPermission
            const isLockedMain =
              item.locked || !hasPermission(item.requiredPermission);

            return (
              <li key={index}>
                {item.subMenu ? (
                  <details>
                    <summary
                      className={`${pathName === item?.path && "active"}`}
                    >
                      <div>
                        <span
                          className="icon"
                          dangerouslySetInnerHTML={{ __html: item?.icon }}
                        ></span>
                        {isSideMenuOpen && (
                          <span className="name">{item.title}</span>
                        )}
                      </div>
                      {isSideMenuOpen && (
                        <div className="drop-down-arrow">
                          <KeyboardArrowDownIcon />
                        </div>
                      )}
                    </summary>
                    <ul>
                      {item.subMenu.map((subItem, subIndex) => {
                        const isLockedSub =
                          subItem.locked ||
                          !hasPermission(subItem.requiredPermission);
                        return (
                          <li key={subIndex}>
                            {isLockedSub ? (
                              // Render lock icon and disable the link for locked items
                              <div className="locked-item">
                                <span className="name">{subItem.title}</span>
                                <span className="lock-icon">
                                  <img src={"/icons/lock.svg"} alt="" />
                                </span>
                              </div>
                            ) : (
                              <Link
                                href={subItem.path}
                                className={`sub-menu-item ${
                                  pathName === subItem?.path &&
                                  "sub-menu-active"
                                }`}
                              >
                                <span className="name">{subItem.title}</span>
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                ) : isLockedMain ? (
                  <div className="locked-item">
                    <span className="icon">
                      <img src={item?.icon ?? "/icons/dashboard.svg"} alt="" />
                    </span>
                    {isSideMenuOpen && (
                      <>
                        <span className="name">{item.title}</span>
                        <span className="lock-icon">
                          <img src={"/icons/lock.svg"} alt="" />
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`menu-item ${
                      pathName === item?.path && "active"
                    }`}
                  >
                    <span
                      className="icon"
                      dangerouslySetInnerHTML={{ __html: item?.icon }}
                    ></span>
                    {isSideMenuOpen && (
                      <span className="name">{item.title}</span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="bottom">
          <ul>
            <li onClick={() => logout()} className="logout">
              <span className="icon">
                <img src={"/icons/logout.svg"} alt="" />
              </span>
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`${isSideMenuOpen ? "active-nav" : ""} hamburger`}
        onClick={(prev) => setSideMenuOpen(!isSideMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  );
};

export default SideNav;
