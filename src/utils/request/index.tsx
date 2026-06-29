import axios from "axios";
import { beforeRequest } from "@/utils/sign";

const instance = axios.create({
  // baseURL: isDev ? "http://localhost:3000" : "https://boboan.net/api", // 根据实际情况修改
  baseURL: "https://boboan.net/api", // 根据实际情况修改
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器：添加接口签名
instance.interceptors.request.use(
  (config) => beforeRequest(config),
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default instance;