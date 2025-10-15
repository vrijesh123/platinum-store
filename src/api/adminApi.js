import APIBase from "@/utils/apiBase";
export const BASE_API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api`

export const userLoginAPI = new APIBase({
    baseURL: `${BASE_API_URL}/token/`,
    // tokenKey: true,
    // debounceDelay: 1000,
});

export const userSignUpAPI = new APIBase({
    baseURL: `${BASE_API_URL}/signup/`,
    // tokenKey: true,
    // debounceDelay: 1000,
});

export const forgotPasswordAPI = new APIBase({
    baseURL: `${BASE_API_URL}/forgotpassword`,
    // tokenKey: true,
    // debounceDelay: 1000,
});

export const LogoutApi = new APIBase({
    baseURL: `${BASE_API_URL}/logout/`,
    tokenKey: "access_token",
    refreshTokenKey: "refresh_token",
    refreshURL: `${BASE_API_URL}/api/token/refresh/`,
});


export const DomainCheckAPI = new APIBase({
    baseURL: `${BASE_API_URL}/check-domain/`,
});



export const contactApi = new APIBase({
    baseURL: `${BASE_API_URL}/contact/`,
    // tokenKey: true,
    // debounceDelay: 1000,
});

export const profileApi = new APIBase({
    baseURL: `${BASE_API_URL}/profile/`,
    tokenKey: true,
});

export const adminMatrixApi = new APIBase({
    baseURL: `${BASE_API_URL}/matrix/`,
    tokenKey: true,
});



export const SiteSettingApi = new APIBase({
    baseURL: `${BASE_API_URL}/site-setting/`,
});

