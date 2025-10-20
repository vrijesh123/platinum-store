import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { LogoutApi, userLoginAPI, userSignUpAPI } from "@/api/adminApi";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { getSubdomain } from "@/utils/commonUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("role");
      const email = localStorage.getItem("email");
      // retrieve your stored permissions as well
      const storedPermissions = JSON.parse(
        localStorage.getItem("permissions") || "[]"
      );

      if (token) {
        const decoded = jwtDecode(token);

        const path = decoded?.is_superuser ? "admin" : "user";
        const role = decoded?.is_superuser ? "Captain" : "User";

        // setUser now also includes the token, role, and email.
        setUser({ ...decoded, token, role, path });

        // set your permissions in React state
        setPermissions(storedPermissions);
      }

      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await userLoginAPI.post("", {
        email,
        password,
      });

      if (response) {
        const { access, refresh, user_id, tenants } = response;

        // In development, use localhost subdomain
        window.location.href = `https://${tenants?.[0]?.schema_name}.theplatinumstore.in/authenticate?access=${access}&refresh=${refresh}`;
      } else {
        // Handle unsuccessful login
        toast.error("Something went wrong, Please try again!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.non_field_errors?.[0] || "Login failed"
      );
    }
  };

  const signup = async (username, first_name, last_name, email, password) => {
    try {
      const response = await userSignUpAPI.post("", {
        username,
        first_name,
        last_name,
        email,
        password,
      });

      if (response) {
        const loginRes = await userLoginAPI.post("", {
          username,
          password,
        });

        if (loginRes) {
          const { access, refresh, is_superuser } = loginRes;
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          const path = is_superuser ? "admin" : "user";
          const role = is_superuser ? "Captain" : "User";

          localStorage.setItem("role", role);

          // Store permissions
          // localStorage.setItem('permissions', JSON.stringify(authenticatedUser.permissions));

          // Update react state for user and permissions
          setUser({ ...loginRes, role: role, path: path });
          // setPermissions(authenticatedUser.permissions);

          if (is_superuser) {
            router.push("/admin/dashboard");
          } else if (!is_superuser) {
            router.push("/user/dashboard");
          } else {
            toast.error("User role not found");
          }
        } else {
          // Handle unsuccessful login
          toast.error("Something went wrong, Please try again!");
        }
      }
    } catch (error) {
      // Handle login error
      console.error("Login error:", error);
      // toast.error(error?.response?.data?.non_field_errors?.[0]);
    }
  };

  const logout = async () => {
    const refreshToken = Cookies.get("refresh_token");

    try {
      await LogoutApi.post("", {
        refresh: refreshToken,
      });

      toast.success("Logged Out Successfully");

      localStorage.clear();
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      setUser(null);
      setPermissions([]);
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL;
    } catch (error) {}
  };

  const clientLogout = async () => {
    const refreshToken = Cookies.get("refresh_token");
    const sub_domain = getSubdomain();

    try {
      await LogoutApi.post("", {
        refresh: refreshToken,
      });

      toast.success("Logged Out Successfully");

      localStorage.clear();
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      setUser(null);
      setPermissions([]);
      window.location.href = `https://${sub_domain}.theplatinumstore.in/login`;
    } catch (error) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        login,
        logout,
        clientLogout,
        signup,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
