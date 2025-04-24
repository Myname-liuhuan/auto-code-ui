// src/utils/request.ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { AppConfig } from '@/config';

const instance = axios.create({
  baseURL: 'http://localhost:' + AppConfig.port,
  timeout: 10000,
  withCredentials: true,
});

// 通用响应数据格式
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }
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
      return Promise.reject(res.msg || 'Error');
    }
    return res.data;
  },
  error => {
    return Promise.reject(error);
  }
);

// 带泛型的封装方法
interface RequestOptions extends AxiosRequestConfig {
  retry?: number;
}

function request<T = any>(config: RequestOptions): Promise<T> {
  const { retry = 0 } = config;
  let attempts = 0;

  const doRequest = (): Promise<T> => {
    return instance(config)
      .then((data: any) => data as T)
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
