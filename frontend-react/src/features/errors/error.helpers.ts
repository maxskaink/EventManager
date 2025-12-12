import { AxiosError } from "axios";

/**
 * Gets the error messsage of a general error for the toast Message
 * @param error Throwned Error
 */
export const getErrorMessageForToast = (error: unknown, defaultMessage?: string) => {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage ?? "Error desconocido";
}