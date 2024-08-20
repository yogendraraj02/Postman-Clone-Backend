import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  queryParams?: Record<string, string>;
  authType?: 'basic' | 'bearer';
  authCredentials?: {
    username?: string;
    password?: string;
    token?: string;
  };
}

export interface ResponseData {
  data: unknown;
  status: number;
  headers: Record<string, string>;
  responseTime: number;
}

const sendRequest = async (config: AxiosRequestConfig): Promise<ResponseData> => {
  const startTime = Date.now();
  
  try {
    const response: AxiosResponse = await axios(config);
    const endTime = Date.now();
    
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
      responseTime: endTime - startTime
    };
  } catch (error) {
    const endTime = Date.now();
    const axiosError = error as AxiosError;
    
    throw {
      error: axiosError.response?.data || axiosError.message,
      status: axiosError.response?.status,
      headers: axiosError.response?.headers as Record<string, string> | undefined,
      responseTime: endTime - startTime
    };
  }
};

export const makeRequest = async (requestConfig: RequestConfig): Promise<ResponseData> => {
  const {
    method,
    url,
    headers = {},
    body,
    queryParams,
    authType,
    authCredentials
  } = requestConfig;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: headers as Record<string, string>,
    params: queryParams
  };

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    config.data = body;
  }

  // Handle authentication
  if (authType === 'basic' && authCredentials?.username && authCredentials?.password) {
    config.auth = {
      username: authCredentials.username,
      password: authCredentials.password
    };
  } else if (authType === 'bearer' && authCredentials?.token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers['Authorization'] = `Bearer ${authCredentials.token}`;
  }

  const result = await sendRequest(config);

  console.log(result);
  return result;
};