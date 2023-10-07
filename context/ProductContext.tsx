"use client";

import { ProductContextProps, ProductProps, userAddress } from "@/interfaces";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider:React.FC<{ children: ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [updated, setUpdated] = useState<boolean>(false);

    const router = useRouter();

    const newProduct = async (product: ProductProps) => {
        try {
            const { data } = await axios.post<userAddress>(
                `${process.env.API_URL}/api/admin/products`,
                product,
            );

            if (data) router.replace("/admin/products");
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
                router.replace("/admin/products");
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

    const updateProduct = async (id: string, product: ProductProps) => {
        try {
            const { data } = await axios.put(`${process.env.API_URL}/api/product/${id}`,
            product);

            if (data?.product) setUpdated(true)
        } catch (error) {
             const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during updated address")
            }
        }
    }

    const deleteAddress = async (id: string) => {
        try {
            const { data } = await axios.delete(`${process.env.API_URL}/api/address/${id}`)

            if (data?.success) router.push("/me")
        } catch (error) {
             const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during deleted address")
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
                clearErrors
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