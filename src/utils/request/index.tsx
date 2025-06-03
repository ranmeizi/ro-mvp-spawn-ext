import axios from "axios";

const isDev = process.env.NODE_ENV === "development";



const instance = axios.create({
  // baseURL: isDev ? "http://localhost:3000" : "https://boboan.net/api", // 根据实际情况修改
  baseURL: "https://boboan.net/api", // 根据实际情况修改
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可在此添加 token 等
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default instance;