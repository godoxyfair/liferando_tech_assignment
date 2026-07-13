import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export type ApiError<E = unknown> = AxiosError<E>

export function isApiError<E = unknown>(
  error: unknown,
): error is AxiosError<E> {
  return axios.isAxiosError(error)
}

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: { indexes: null },
})

/**
 * D - request body type
 * T - response type
 * Q - query type
 */
export async function apiRequest<D, T = void, Q = Record<string, never>>(
  url: string,
  options?: AxiosRequestConfig<D>,
  query?: Q,
): Promise<AxiosResponse<T>> {
  try {
    const response: AxiosResponse<T> = await api.request<
      T,
      AxiosResponse<T>,
      D
    >({
      url,
      params: query,
      withCredentials: true,
      ...options,
    })

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error
    }
    throw new AxiosError(String(error))
  }
}
