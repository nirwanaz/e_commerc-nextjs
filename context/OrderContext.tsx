"use client";

import { OrderContextProps } from "@/interfaces";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider:React.FC<{ children: ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [updated, setUpdated] = useState<boolean>(false);
    const [canReview, setCanReview] = useState<boolean>(false);

    const router = useRouter();

    const updateOrder = async (id: string, orderData: { orderStatus: string }) => {
        try {
            const { data } = await axios.put(`${process.env.API_URL}/api/admin/orders/${id}`,
            orderData);

            if (data?.success) {
                setUpdated(true);
                router.replace(`/admin/orders/${id}`);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during updated order")
            }
        }
    }

    const deleteOrder = async (id: string) => {
        try {
            const { data } = await axios.delete(`${process.env.API_URL}/api/admin/orders/${id}`)

            if (data?.success) router.replace("/admin/orders");

        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during deleted order")
            }
        }
    }

    const canUserReview = async (id: string) => {
        try {
            const { data } = await axios.get(`${process.env.API_URL}/api/orders/can_review?productId=${id}`);

            if (data?.canReview) {
                setCanReview(data?.canReview);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during user review")
            }
        }
    }

    const clearErrors = () => {
        setError(null);
    };

    return (
        <OrderContext.Provider
            value={{
                error,
                loading,
                updated,
                canReview,
                setUpdated,
                updateOrder,
                deleteOrder,
                canUserReview,
                clearErrors,
            }}
        >
            {children}
        </OrderContext.Provider>
    )
}

// Custom hook to access the authentication context
export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error("useOrder must be used within an OrderProvider");
    }

    return context;
}