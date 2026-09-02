import { toast } from "sonner";
import { EntityError } from "@/lib/http";
import { type ClassValue, clsx } from "clsx";
import { UseFormSetError, FieldValues, FieldPath } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = <T extends FieldValues>({
  error,
  setError,
  duration,
}: {
  error: Error | EntityError | unknown;
  setError?: UseFormSetError<T>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field as FieldPath<T>, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { payload?: { message?: string } })?.payload?.message ??
          "Lỗi không xác định";

    toast.error(errorMessage, {
      duration: duration ?? 5000,
    });
  }
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const decodeJWT = <Payload = Record<string, unknown>>(token: string) => {
  return jwt.decode(token) as Payload;
};

export const getTokenExpiry = (token: string): number | null => {
  const decoded = decodeJWT<{ exp?: number }>(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
};

export const convertSlugUrl = (text: string) => {
  if (!text) return "";
  return slugify(text, { lower: true, locale: "vi" });
};
