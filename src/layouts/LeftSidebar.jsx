import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { getMenuItems } from "@/helpers/menu";
import axios from "axios"; // already imported

// components
import AppMenu from "./Menu";
import profileImg from "@/assets/images/users/user-1.jpg";
import logoSm from "@/assets/images/logo-sm.png";
import logoDark from "@/assets/images/logo-dark.png";
import logoDark2 from "@/assets/images/logo-dark-2.png";
import logoLight from "@/assets/images/logo-light.png";
import logoLight2 from "@/assets/images/logo-light-2.png";
import { FiUser, FiSettings, FiLock, FiLogOut } from "react-icons/fi";
import { useLayoutContext } from "@/context/useLayoutContext.jsx";

/* user box */
const UserBox = () => {
  const ProfileMenus = [
    { label: "My Account", icon: FiUser, redirectTo: "#" },
    { label: "Settings", icon: FiSettings, redirectTo: "#" },
    { label: "Lock Screen", icon: FiLock, redirectTo: "/auth/lock-screen" },
    { label: "Logout", icon: FiLogOut, redirectTo: "/auth/logout" },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found in localStorage.");
        setRoleError(true);
        setRole("");
        return;
      }

      try {
        console.log("Auth token being sent:", token);

        const response = await axios.get(`${apiUrl}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          withCredentials: true,
        });

        const data = response.data;
        console.log("✅ API Response:", data);

        // Extract the role from primary_role or roles[0]
        let userRole = data.primary_role || (Array.isArray(data.roles) && data.roles.length > 0 ? data.roles[0] : "");

        console.log("📌 Extracted userRole:", userRole);

        if (userRole) {
          setRole(userRole);
          setRoleError(false);
        } else {
          setRoleError(true);
        }
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Axios error response:", error.response);
          if (error.response.status === 401) {
            console.error("Unauthorized: Invalid or expired token.");
            setRoleError(true);
            setRole("");
            // Optionally, you can redirect to login or clear the token here
          } else {
            setRoleError(true);
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error("Axios error request:", error.request);
          setRoleError(true);
        } else {
          // Something else happened
          console.error("Axios error:", error.message);
          setRoleError(true);
        }
      }
    };

    fetchUserRole();
  }, []);
  

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="user-box text-center">
      <img src={profileImg} alt="" title="Mat Helme" className="rounded-circle avatar-md" />
      <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
        <Dropdown.Toggle
          id="dropdown-notification"
          as="a"
          onClick={toggleDropdown}
          className="cursor-pointer text-dark h5 mt-2 mb-1 d-block"
        >
          Geneva Kennedy
        </Dropdown.Toggle>
        <Dropdown.Menu className="user-pro-dropdown">
          <div onClick={toggleDropdown}>
            {(ProfileMenus || []).map((item, index) => (
              <Link to={item.redirectTo} className="dropdown-item notify-item" key={index}>
                <item.icon className="me-1" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <p className="text-muted">
        {roleError
          ? "Role unavailable"
          : role
          ? role.charAt(0).toUpperCase() + role.slice(1)
          : ""}
      </p>
    </div>
  );
};

/* sidebar content */
const SideBarContent = () => {
  return (
    <>
      <UserBox />
      <AppMenu menuItems={getMenuItems()} />
      <div className="clearfix" />
    </>
  );
};

const LeftSidebar = ({
  isCondensed = false,
  hideLogo
}) => {
  const menuNodeRef = useRef(null);
  const { orientation } = useLayoutContext();

  const handleOtherClick = (e) => {
    if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
    if (document.body) {
      document.body.classList.remove("sidebar-enable");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOtherClick, false);
    return () => {
      document.removeEventListener("mousedown", handleOtherClick, false);
    };
  }, []);

  return (
    <div className="app-menu" ref={menuNodeRef}>
      {!hideLogo && (
        <div className="logo-box">
          <Link to="/" className="logo logo-dark text-center">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={orientation === "two-column" ? logoDark2 : logoDark} alt="" height="20" />
            </span>
          </Link>
          <Link to="/" className="logo logo-light text-center">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={orientation === "two-column" ? logoLight2 : logoLight} alt="" height="20" />
            </span>
          </Link>
        </div>
      )}
      {!isCondensed ? (
        <SimpleBar className="scrollbar show h-100" scrollbarMaxSize={320}>
          <SideBarContent />
        </SimpleBar>
      ) : (
        <SideBarContent />
      )}
    </div>
  );
};
// Remove this line:
// LeftSidebar.defaultProps = {
//   isCondensed: false
// };
export default LeftSidebar;
