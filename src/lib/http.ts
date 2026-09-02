import { AuthActionTypes } from "@/types/shared";
import envConfig from "./config";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method" | "body"> & {
  baseUrl?: string | undefined;
  body?: any;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError<T = unknown> extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: unknown;
  };
  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: { message: string } & Record<string, T>;
  }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

const clientLogoutRequest: null | Promise<Response> = null;
let isRefreshing = false;
let failedQueue: { resolve: (token: string | null) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
export const isClient = () => typeof window !== "undefined";

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient()) {
    const sessionToken = localStorage.getItem(AuthActionTypes.ACCESS_TOKEN);
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  // Interceptor là nơi chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient()) {
        const originalRequest = async () => {
          const newToken = localStorage.getItem(AuthActionTypes.ACCESS_TOKEN);
          if (newToken) {
            baseHeaders.Authorization = `Bearer ${newToken}`;
          }
          const retryRes = await fetch(fullUrl, {
            ...options,
            headers: {
              ...baseHeaders,
              ...options?.headers,
            },
            body,
            method,
          });
          const retryPayload = await retryRes.json();
          if (!retryRes.ok) {
             throw new HttpError({ status: retryRes.status, payload: retryPayload });
          }
          return { status: retryRes.status, payload: retryPayload };
        };

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(
              `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/refresh`,
              {
                method: "POST",
                credentials: "include", // Quan trọng để browser gửi cookie refreshToken
                headers: { "Content-Type": "application/json" }
              }
            );
            
            const refreshData = await refreshRes.json();
            
            if (refreshRes.ok && refreshData.result?.accessToken) {
              localStorage.setItem(AuthActionTypes.ACCESS_TOKEN, refreshData.result.accessToken);
              processQueue(null, refreshData.result.accessToken);
              return (await originalRequest()) as typeof data;
            } else {
              throw new Error("Refresh failed");
            }
          } catch (error) {
            processQueue(error, null);
            localStorage.removeItem(AuthActionTypes.ACCESS_TOKEN);
            localStorage.removeItem(AuthActionTypes.REFRESH_TOKEN);
            location.href = "/auth/login";
            throw new HttpError(data as any);
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(async () => {
              return (await originalRequest()) as typeof data;
            })
            .catch((err) => {
              throw err;
            });
        }
      } else {
        const sessionToken = (
          options?.headers as Record<string, string> | undefined
        )?.Authorization.split("Bearer ")[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      // Fix: Type assertion để đảm bảo payload có message
      throw new HttpError(
        data as {
          status: number;
          payload: { message: string } & Record<string, unknown>;
        }
      );
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  patch<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PATCH", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
