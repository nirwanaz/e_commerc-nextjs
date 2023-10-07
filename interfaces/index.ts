import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import { Key } from "react"

export interface fetchAPIProps {
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextApiHandler
}

export interface productImage {
    public_id: string,
    url: string
}

export interface ProductProps {
    name: string,
    description: string,
    price: number,
    images?: productImage[],
    category: string,
    seller: string,
    stock: number,
    ratings?: number,
    createdAt?: string,
    _id?: Key
}

export type ProductContextProps = {
    error: string | null;
    loading: boolean | null;
    updated: boolean;
    setUpdated: (updated: boolean) => void;
    newProduct: (product: ProductProps) => void;
    uploadProductImages: (formData: FormData, id: string) => void;
    clearErrors: () => void;
}

export interface CartItemProps {
    product: string | number;
    name: string;
    price: number;
    image?: string;
    stock: number;
    seller: string;
    quantity: number | 1;
}

export interface CartProps {
    cartItems: CartItemProps[];
    checkoutInfo?: {
        amount: number;
        tax: string;
        totalAmount: string;
    }
}

export interface PaymentInfoProps {
    id: string;
    status: string;
    taxPaid: number;
    amountPaid: number;
}

export interface OrderItemProps {
    product: ProductProps;
    name: string;
    quantity: string;
    image: string;
    price: string;
}

export interface OrderProps {
    _id: Key;
    shippingInfo: userAddress;
    user: User;
    orderItems: OrderItemProps[];
    paymentInfo: PaymentInfoProps;
    orderStatus: string;
    createdAt: string;
}

export type CartContextProps = {
    cart: CartProps;
    addItemToCart: (item: CartItemProps) => void;
    saveOnCheckout: ({ amount, tax, totalAmount }: { amount: number; tax: string; totalAmount: string; }) => void;
    deleteItemFromCart: (id: string | number) => void;
    clearCart: () => void;
}

export interface User {
    id: string | number;
    name: string;
    email: string;
    password?: string;
    avatar?: {
        public_id: string,
        url: string
    };
    role: string | "user",
    createdAt: string
}

export interface userAddress {
    _id: Key;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNo: string;
    country: string;
}

export interface AuthContextProps {
    user: User | null;
    error: string | null;
    loading: boolean | null;
    updated: boolean;
    setUpdated: (updated: boolean) => void;
    setUser: (user: User | null) => void;
    registerUser: (userData: { name: string, email: string, password: string }) => void;
    updateProfile: (formData: FormData) => void;
    updatePassword: (currentPassword: string, newPassword: string) => void;
    addNewAddress: (address: userAddress) => void;
    updateAddress: (id: string, address: userAddress) => void;
    deleteAddress: (id: string) => void;
    clearErrors: () => void;
}