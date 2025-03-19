import axios, { AxiosInstance, AxiosError, RawAxiosRequestHeaders } from 'axios';
import { API_CONFIG } from '../../config/api.config';
// import { authStore } from '../../stores/authStore';

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private accountUuid: string;
  private championToken: string;
  private championApiUrl: string;

  private constructor() {
    this.accountUuid = import.meta.env.VITE_ACCOUNT_UUID || '';
    this.championToken = import.meta.env.VITE_CHAMPION_TOKEN || '';
    this.championApiUrl = 'http://mobile-backend-service-mock-gray:3000/';

    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      // Don't set default headers here, we'll add them in the mergeHeaders method
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        // Log request for debugging
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data,
          params: config.params
        });
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data
        });
        return response;
      },
      (error: AxiosError) => {
        console.error('Response error:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        
        if (error.response?.status === 401) {
          console.error('Unauthorized access');
        }
        return Promise.reject(error);
      }
    );
  }

  private mergeHeaders(customHeaders?: RawAxiosRequestHeaders): Record<string, string> {
    // Create a plain object with string keys and values for fetch API
    const headers: Record<string, string> = {};
    
    // Add headers in the exact order they appear in the Postman collection
    if (customHeaders?.['Content-Type']) {
      headers['Content-Type'] = customHeaders['Content-Type'] as string;
    } else {
      headers['Content-Type'] = 'application/json';
    }
    
    headers['Authorization'] = `Bearer ${this.championToken}`;
    headers['champion-url'] = this.championApiUrl;

    return headers;
  }

  public async get<T>(url: string, params?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    // Add account_uuid as a query parameter
    const accountUuid = this.accountUuid;
    let urlWithParams = url.includes('?') ?
      `${url}&account_uuid=${accountUuid}` :
      `${url}?account_uuid=${accountUuid}`;
    
    // Add any additional params to the URL
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      const queryString = queryParams.toString();
      if (queryString) {
        urlWithParams = `${urlWithParams}&${queryString}`;
      }
    }
    
    // Use fetch API directly for more control over headers
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: this.mergeHeaders(headers),
      referrerPolicy: 'no-referrer'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json() as T;
  }

  public async post<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    // Add account_uuid as a query parameter
    const accountUuid = this.accountUuid;
    const urlWithParams = url.includes('?') ?
      `${url}&account_uuid=${accountUuid}` :
      `${url}?account_uuid=${accountUuid}`;
    
    // Use fetch API directly for more control over headers
    const response = await fetch(urlWithParams, {
      method: 'POST',
      headers: this.mergeHeaders(headers),
      body: data ? JSON.stringify(data) : undefined,
      referrerPolicy: 'no-referrer'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json() as T;
  }

  public async put<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    // Add account_uuid as a query parameter
    const accountUuid = this.accountUuid;
    const urlWithParams = url.includes('?') ?
      `${url}&account_uuid=${accountUuid}` :
      `${url}?account_uuid=${accountUuid}`;
    
    // Use fetch API directly for more control over headers
    const response = await fetch(urlWithParams, {
      method: 'PUT',
      headers: this.mergeHeaders(headers),
      body: data ? JSON.stringify(data) : undefined,
      referrerPolicy: 'no-referrer'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json() as T;
  }

  public async delete<T>(url: string, headers?: RawAxiosRequestHeaders): Promise<T> {
    // Add account_uuid as a query parameter
    const accountUuid = this.accountUuid;
    const urlWithParams = url.includes('?') ?
      `${url}&account_uuid=${accountUuid}` :
      `${url}?account_uuid=${accountUuid}`;
    
    // Use fetch API directly for more control over headers
    const response = await fetch(urlWithParams, {
      method: 'DELETE',
      headers: this.mergeHeaders(headers),
      referrerPolicy: 'no-referrer'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json() as T;
  }

  public async patch<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    // Add account_uuid as a query parameter
    const accountUuid = this.accountUuid;
    const urlWithParams = url.includes('?') ?
      `${url}&account_uuid=${accountUuid}` :
      `${url}?account_uuid=${accountUuid}`;
    
    // Use fetch API directly for more control over headers
    const response = await fetch(urlWithParams, {
      method: 'PATCH',
      headers: this.mergeHeaders(headers),
      body: data ? JSON.stringify(data) : undefined,
      referrerPolicy: 'no-referrer'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json() as T;
  }
}

export const apiService = ApiService.getInstance();
