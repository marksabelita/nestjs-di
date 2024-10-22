import { Inject, Injectable } from '@nestjs/common';
import {
  HTTP_MODULE_OPTIONS,
  IHttpService,
  IHttpModuleOptions,
} from './http.interface';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService implements IHttpService {
  private axiosInstance: AxiosInstance;

  constructor(
    @Inject(HTTP_MODULE_OPTIONS) private readonly options: IHttpModuleOptions,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.options.baseURL,
      timeout: this.options.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(
      url,
      config,
    );
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      url,
      data,
      config,
    );
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(
      url,
      config,
    );
    return response.data;
  }
}
