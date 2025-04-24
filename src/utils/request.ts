// src/utils/request.ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { AppConfig } from '@/config';
// import { message } from 'antd'; // 全局提示用的，也可以换成ElMessage之类的

const isDev = import.meta.env.MODE === 'development';

const instance = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? AppConfig.devServerUrl
    : AppConfig.apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
});

// 通用响应数据格式
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// ========== 拦截器 ==========

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }
    // loading.start();
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res.code !== 0) {
      // message.error(res.msg || '请求失败');
      return Promise.reject(res.msg || 'Error');
    }
    return res.data; // 这里直接返回 data 字段
  },
  error => {
    // message.error(error.response?.data?.message || error.message || '服务器异常');
    return Promise.reject(error);
  }
);

// ========== 带泛型的封装方法 ==========

interface RequestOptions extends AxiosRequestConfig {
  retry?: number;
}

function request<T = any>(config: RequestOptions): Promise<T> {
  const { retry = 0 } = config;
  let attempts = 0;

  const doRequest = (): Promise<T> => {
    return instance(config)
      .then((data: any) => data as T) // 强制返回你定义的类型
      .catch(err => {
        if (attempts < retry) {
          attempts++;
          return doRequest();
        }
        return Promise.reject(err);
      });
  };

  return doRequest();
}

export default request;
