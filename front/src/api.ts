import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Token } from './utils';
import { HttpCode } from './const';
import { ValidationErrorField } from './types/error';

export const BACKEND_URL = 'http://localhost:5000';
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = Token.get();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const { response } = error;
      toast.dismiss();

      if (response) {
        switch (response.status) {
          case HttpCode.BadRequest:
            if (response.data.details.length) {
              response.data.details.forEach((detail: ValidationErrorField) =>
                detail.messages.forEach((message: string) =>
                  toast.warn(message)
                )
              );
            } else {
              toast.warn(response.data.message);
            }
            break;
          case HttpCode.NoAuth:
          case HttpCode.NotFound:
            toast.info(response.data.error);
            toast.info(response.data.message);
            break;
          case HttpCode.Conflict:
            toast.warn(response.data.message);
            break;
          case HttpCode.ServerIternal:
            toast.error('Server Iternal Error');
            break;
        }
      }

      toast.warn(error.response ? error.response.data.error : error.message);

      return Promise.reject(error);
    }
  );

  return api;
};
