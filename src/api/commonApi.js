import APIBase from "@/utils/apiBase";
import { BASE_API_URL } from "./loginAPI";



export const caseStudyApi = new APIBase({
    baseURL: `${BASE_API_URL}/case-study/`,
    // tokenKey: true,
    // debounceDelay: 1000,
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

export const FaqApi = new APIBase({
    baseURL: `${BASE_API_URL}/faq/`,
});


////////////// Blogs ////////////////////////

export const BlogListApi = new APIBase({
    baseURL: `${BASE_API_URL}/blog/`,
});

export const BlogCategoryApi = new APIBase({
    baseURL: `${BASE_API_URL}/blog-category/`,
});


export const SiteSettingApi = new APIBase({
    baseURL: `${BASE_API_URL}/site-setting/`,
});

