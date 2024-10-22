import { AxiosRequestConfig } from 'axios';

export const HTTP_MODULE_OPTIONS = Symbol('HTTP_MODULE_OPTIONS');

export interface IHttpModuleOptions {
  baseURL: string;
  timeout?: number;
}

export interface IHttpService {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export const IHttpService = Symbol('IHttpService');
