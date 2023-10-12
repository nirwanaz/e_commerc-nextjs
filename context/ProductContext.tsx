"use client";

import { NewProductProps, ProductContextProps, userAddress } from "@/interfaces";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider:React.FC<{ children: ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [updated, setUpdated] = useState<boolean>(false);

    const router = useRouter();

    const newProduct = async (product: NewProductProps) => {
        try {
            const { data } = await axios.post<userAddress>(
                `${process.env.API_URL}/api/admin/products`,
                product,
            );

            if (data) router.push("/admin/products");
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during add new product")
            }
        }
    }

    const uploadProductImages = async (formData: FormData, id: string) => {
        try {
            setLoading(true);

            const { data } = await axios.post(`${process.env.API_URL}/api/admin/products/upload_images/${id}`, formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (data?.data) {
                setLoading(false);
                router.push("/admin/products");
            }

        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during upload product images")
            }
        }
    }

    const updateProduct = async (product: NewProductProps, id: string) => {
        try {
            const { data } = await axios.put(`${process.env.API_URL}/api/admin/products/${id}`,
            product);

            if (data?.product) {
                setUpdated(true);
                router.replace(`/admin/products/${id}`);
            }
        } catch (error) {
             const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during updated product")
            }
        }
    }

    const deleteProduct = async (id: string) => {
        try {
            const { data } = await axios.delete(`${process.env.API_URL}/api/admin/products/${id}`)

            if (data?.success) router.replace("/admin/products");

        } catch (error) {
             const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during deleted product")
            }
        }
    }

    const postReview = async (reviewData: { rating: number, comment: string, productId: string }) => {
        try {
            const { data } = await axios.put(`${process.env.API_URL}/api/products/review`, reviewData);

            if (data?.success) {
                router.replace(`/product/${reviewData?.productId}`);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during post review")
            }
        }
    }

    const clearErrors = () => {
        setError(null);
    };

    return (
        <ProductContext.Provider
            value={{
                error,
                loading,
                updated,
                setUpdated,
                newProduct,
                uploadProductImages,
                updateProduct,
                deleteProduct,
                postReview,
                clearErrors,
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}

// Custom hook to access the authentication context
export const useProduct = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProduct must be used within an ProductProvider");
    }

    return context;
}