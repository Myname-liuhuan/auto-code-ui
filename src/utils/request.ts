// src/utils/request.ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.host}`,
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
  async (response: AxiosResponse) => {
    const contentType = response.headers['content-type'];

    // ✅ 如果是 blob 类型（下载文件）
    if (contentType && contentType.includes('application/octet-stream')) {
      return response.data;
    }

    // ✅ 如果是 json 格式
    const res = response.data;
    if (res.code !== 200) {
      return Promise.reject(res.message || 'Error');
    }
    return res.data;
  },
  async error => {
    // ❌ 捕获 blob 类型的错误响应，解析成 JSON 错误信息
    const isBlob = error.response?.data instanceof Blob && error.response?.data.type === 'application/json';

    if (isBlob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        return Promise.reject(json.message || '下载失败');
      } catch (e) {
        return Promise.reject('未知 blob 错误');
      }
    }

    return Promise.reject(error.message || '请求失败');
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
