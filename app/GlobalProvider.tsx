"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import CartProvider from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { SessionProvider } from "next-auth/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface GlobalProviderProps {
	children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
    return (
        <>
            <ToastContainer position="bottom-right" />
            <AuthProvider>
                <CartProvider>
                    <ProductProvider>
                        <SessionProvider>{children}</SessionProvider>
                    </ProductProvider>
                </CartProvider>
            </AuthProvider>
        </>
    )
}