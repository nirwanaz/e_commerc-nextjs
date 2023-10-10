"use client";

import { AuthContextProps, User, userAddress, userData } from "@/interfaces";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider:React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [updated, setUpdated] = useState<boolean>(false);

    const router = useRouter();

    const registerUser = async ({ name, email, password }: {
        name: string;
        email: string;
        password: string;
    }) => {
        try {
            const { data } = await axios.post<{ user: User }>(
                `${process.env.API_URL}/api/auth/register`,
                {
                    name,
                    email,
                    password,
                }
            );

            if (data?.user) {
                setUser(data.user)
                router.push("/")
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>

            if (axiosError.response) {
                setError(axiosError.response.data.message);

            } else {
                setError("An Error occured during registration.");
            }
        }
    };

    const loadUser = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("/api/auth/session?update");

            if (data?.user) {
                setUser(data.user);
                router.replace("/me")
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during load user")
            }
        }
    }

    const updateProfile = async (formData: FormData) => {
        try {
            setLoading(true);

            const { data } = await axios.put(`${process.env.API_URL}/api/auth/me/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (data?.user) {
                loadUser();
                setLoading(false);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during update profile")
            }
        }
    }

    const updatePassword = async (currentPassword: string, newPassword: string) => {
        try {
            const { data } = await axios.put(`${process.env.API_URL}/api/auth/me/update_password`, {
                currentPassword,
                newPassword
            });

            if (data?.success) router.replace("/me")
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during update password")
            }
        }
    }

    const updateUser = async (id: string, userData: userData) => {
        try {
            const { data } = await axios.put(`${process.env.API_URL}/api/admin/users/${id}`, { userData });

            if (data?.success) {
                setUpdated(true);
                router.replace(`/admin/users`);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during update user")
            }
        }
    }

    const deleteUser = async (id: string) => {
        try {
            const { data } = await axios.delete(`${process.env.API_URL}/api/admin/users/${id}`);

            if (data?.success) {
                router.replace(`/admin/users`);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during delete user")
            }
        }
    }

    const addNewAddress = async (address: userAddress) => {
        try {
            const { data } = await axios.post<userAddress>(
                `${process.env.API_URL}/api/address`,
                address,
            );

            if (data) router.push("/me");
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                setError(axiosError.response.data.message)
            } else {
                setError("An Error occured during add new address")
            }
        }
    }

    const updateAddress = async (id: string, address: userAddress) => {
        try {
            const { data } = await axios.put(`${process.env.API_URL}/api/address/${id}`,
            address);

            if (data?.address) setUpdated(true)
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
        <AuthContext.Provider
            value={{
                user,
                error,
                loading,
                updated,
                setUpdated,
                setUser,
                registerUser,
                updateProfile,
                updatePassword,
                updateUser,
                deleteUser,
                addNewAddress,
                updateAddress,
                deleteAddress,
                clearErrors
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to access the authentication context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}