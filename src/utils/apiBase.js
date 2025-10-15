import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default class APIBase {
  // Constructor to initialize APIBase with custom configuration
  constructor(config) {
    if (!config.baseURL) throw new Error("Base URL cannot be empty");
    // if (!config.defaultHeaders) throw new Error('Default headers cannot be empty');
    // console.log('HEADERS: ',JSON.stringify(config))

    // Configuration defaults are set here, allowing for customization
    this.config = {
      baseURL: config.baseURL, // Base URL for API requests
      defaultHeaders: config.defaultHeaders || {
        "Content-Type": "application/json",
        // "ngrok-skip-browser-warning": "true",
      }, // Default headers for all requests
      timeout: config.timeout || 30000, // Request timeout in milliseconds
      tokenKey: config.tokenKey || false, // Key for storing JWT token in local storage
      retryLimit: config.retryLimit || 1, // Number of retries for failed requests
      debounceDelay: config.debounceDelay || 0,
      // Delay for debouncing requests
      // Additional configurable parameters can be added here
    };


    // Creating an axios instance with the provided configuration
    this.apiClient = axios.create({
      baseURL: this.config.baseURL,
      headers: this.config.defaultHeaders,
      timeout: this.config.timeout,
    });

    // Bind methods to ensure 'this' context
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);

    // Interceptors for handling request and response
    this.apiClient.interceptors.request.use((config) => {
      // Your request interception logic here
      // E.g., adding a token
      this.addToken();
      return config;
    }, error => {
      // Do something with request error
      return Promise.reject(error);
    });


    // this.apiClient.interceptors.response.use(
    //     this.handleSuccessResponse,
    //     this.handleErrorResponse
    // );

    // Debounce Settings
    if (this.config.debounceDelay) {
      // Apply debouncing only if debounceDelay is configured
      this.get = this.debounceRequest(this.get);
      this.post = this.debounceRequest(this.post);
      // ... similarly for put, patch, delete
    }
  }

  addToken(token) {
    if (token) {
      this.config.headers["Authorization"] = `JWT ${token}`;
    }
  }

  // Method to handle request interception, e.g., to add auth tokens
  handleRequestInterception = (config) => {
    this.addToken();
  };

  // Method to handle successful responses
  handleSuccessResponse = (response) => {
    return response;
  };

  extract_error_message = (data) => {
    // Check if the data is an object and handle it accordingly
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Handle the specific case where data contains a nested response object
      if (data.response && typeof data.response === 'object') {
        const { code, invalid, message } = data.response;
        let invalidMessages = '';
        if (Array.isArray(invalid)) {
          invalidMessages = invalid?.map(item => `ID: ${item.id}, Year: ${item.year}`).join('; ');
        }
        return `${message}, Invalid: ${invalidMessages}`;
      }

      return Object.entries(data)
        .map(([key, value]) => {
          // Assume value is an array of messages; join them if there are many
          const messages = Array.isArray(value) ? value.join(', ') : value;
          return `${messages}`;
        })
        .join('\n'); // Separate multiple errors with a semicolon and space
    }

    // Default generic error message
    return data?.error || data?.detail || data?.details || data?.message || data?.response?.message || "An unexpected error occurred";
  };

  handleErrorResponse = (error) => {
    const { response } = error;

    if (response) {
      const { status, data, config } = response;
      const errorMessage = this.extract_error_message(data);  // Use the new function here
      const token = Cookies.get('access_token')

      console.error("Error status:", status, errorMessage);
      console.error("Error data:", data, token);
      console.error("Error config:", config);

      // Check if the response is a 401 with a specific token expiration message
      if (
        status === 401 &&
        data?.code == "token_not_valid"
      ) {
        // Clear the token from local storage
        localStorage.clear()
        Object.keys(Cookies.get()).forEach((cookieName) => {
          Cookies.remove(cookieName);
        })

        // Show an alert message and redirect the user to the login page
        Swal.fire({
          title: "Session Expired!",
          text: "Your token has expired. Would you like to login again?",
          icon: "warning",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = process.env.NEXT_PUBLIC_BASE_URL; // Redirect to login page
          }
        });

        return;
      }

      // Check if the response is a 400 with Invalid session
      if (
        token &&
        status === 400 &&
        (data?.error === "Invalid Session!" || data?.detail === "Invalid Session")
      ) {
        // Clear the token from local storage
        localStorage.clear()
        Object.keys(Cookies.get()).forEach((cookieName) => {
          Cookies.remove(cookieName);
        })

        // Show an alert message and redirect the user to the login page
        Swal.fire("Invalid Session!", "Your Session Is Invalid, Please Login Again", "warning").then(() => {
          window.location.href = "/login"; // Redirect to login page
        });
        return;
      }

      // Check if the response is a 403 with Permission denied
      if (
        token &&
        status === 403 &&
        (data?.error === "You do not have permission to perform this action." || data?.detail === "You do not have permission to perform this action.")
      ) {
        // Clear the token from local storage
        localStorage.clear()
        Object.keys(Cookies.get()).forEach((cookieName) => {
          Cookies.remove(cookieName);
        })

        // Show an alert message and redirect the user to the login page
        Swal.fire("No Permission!", "You do not have permission for this page", "warning").then(() => {
          window.location.href = "/login"; // Redirect to login page
        });
        return;
      }

      // console.log('fndsfnd', data, status)

      // Handling errors based on the HTTP method used
      if (['post', 'delete', 'patch', 'put'].includes(config.method.toLowerCase())) {
        switch (status) {
          case 404:
            toast.error(`Not Found: ${errorMessage}`);
            throw error;
          case 403:
            toast.error(`Permission Denied: ${errorMessage}`);
            throw error;
          case 500:
            toast.error(`Server Error: ${errorMessage}`);
            throw error;
          case 400:
            toast.error(`Bad Request: ${errorMessage}`);
            throw error;
          default:
            toast.error(`Error: ${errorMessage}`);
        }
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
      toast.error("Network Error: No response was received");
    } else {
      console.error("Error message:", error.message);
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    }

    // return Promise.reject(error);
  };

  // General method to make an API request
  async makeRequest(
    method,
    endpoint = "",
    data = null,
    headers = {},
    params = ""
  ) {
    const fullEndpoint = endpoint || this.config.baseURL;
    const effectiveHeaders = { ...this.config.defaultHeaders, ...headers };

    const debouncedFunc = this.debounceRequest(async () => {
      const response = await this.apiClient({
        method,
        url: fullEndpoint + params,
        data,
        headers: effectiveHeaders,
      });
      return response.data;
    });

    try {
      return await debouncedFunc();
    } catch (error) {
      this.handleErrorResponse(error);
      if (error?.response?.status == 404) {
        return error;
      } else {
        throw error;
      }
    }
  }

  // Specific methods for different HTTP verbs
  get(endpoint = "", params = "", headers = {}) {
    if (this.config.tokenKey) {
      // console.log("TOKEN KEY");
      headers = this.buildAuthHeader(this.getToken());
    }

    return this.makeRequest("get", endpoint, null, headers, params);
  }

  // post(endpoint = "", data, headers = {}) {
  //   if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());

  //   return this.makeRequest("post", endpoint, data, headers);
  // }

  post(endpoint = "", data, headers = {}) {
    if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());

    // If data is FormData, let browser/axios set proper Content-Type
    const isFormData = data instanceof FormData;
    if (isFormData) {
      // Don't manually set Content-Type so that boundary is auto-handled
      headers["Content-Type"] = undefined;
    }

    return this.makeRequest("post", endpoint, data, headers);
  }


  put(endpoint = "", data, headers = {}) {
    if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());
    return this.makeRequest("put", endpoint, data, headers);
  }

  // patch(endpoint = "", data, headers = {}) {
  //   if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());
  //   return this.makeRequest("patch", endpoint, data, headers);
  // }

  patch(endpoint = "", data, headers = {}) {
    if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());

    // If data is FormData, let browser/axios set proper Content-Type
    const isFormData = data instanceof FormData;
    if (isFormData) {
      // Don't manually set Content-Type so that boundary is auto-handled
      headers["Content-Type"] = undefined;
    }

    return this.makeRequest("patch", endpoint, data, headers);
  }

  delete(endpoint = "", headers = {}) {
    if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());
    return this.makeRequest("delete", endpoint, null, headers);
  }

  // Add this to your APIBase class
  secureDelete(endpoint = "", pk, password, headers = {}) {
    if (this.config.tokenKey) {
      headers = { ...headers, ...this.buildAuthHeader(this.getToken()) };
    }

    return this.apiClient({
      method: "delete",
      url: endpoint,
      data: { pk, password },
      headers: { ...this.config.defaultHeaders, ...headers },
      credentials: "include",
    });
  }

  // Methods for token management in local storage
  getToken() {
    return Cookies.get('access_token');
  }

  setToken(token) {
    localStorage.setItem(this.config.tokenKey, token);
  }

  removeToken() {
    localStorage.removeItem(this.config.tokenKey);
  }

  // Utility method to format dates
  formatDate(date) {
    return new Date(date).toLocaleDateString("en-US");
  }

  // Utility method to parse JSON safely
  parseJSON(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      return null;
    }
  }

  // Utility method to serialize URL parameters
  serializeParams(params) {
    return Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }

  // Method to check if response status is successful
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(response.statusText);
    }
  }

  // Method to extract error message from response
  extractErrorMessage(error) {
    return error.response ? error.response.data.message : error.message;
  }

  // Method to build Authorization header
  buildAuthHeader(token) {
    // return { Authorization: `JWT ${token}` };
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Utility method for logging requests
  logRequest(url, method, data) {
    // console.log(`Requesting ${method.toUpperCase()} ${url} with data:`, data);
  }

  // Debounce utility to prevent rapid firing of requests
  debounceRequest(func) {
    let inDebounce;
    return async (...args) => {
      clearTimeout(inDebounce);
      return new Promise((resolve, reject) => {
        inDebounce = setTimeout(async () => {
          try {
            resolve(await func(...args));
          } catch (error) {
            reject(error);
          }
        }, this.config.debounceDelay);
      });
    };
  }

  // Method for validating response schema (implementation pending)
  validateResponseSchema(response, schema) {
    // Implement schema validation logic if required
  }

  // Interceptor for token refresh logic
  tokenRefreshInterceptor(apiClient, refreshToken) {
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // Implement token refresh logic here
          return apiClient(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }
}
