import { deleteProduct } from "@/backend/controllers/productController"
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

export interface ProductReview {
    user: User;
    rating: number;
    comment: string;
    createdAt: string;
    productId: string;
}

export interface NewProductProps {
    name: string;
    description: string;
    price: number;
    category: string,
    seller: string;
    stock: number;
}

export interface ProductProps {
    name: string;
    description: string;
    price: number;
    images: productImage[];
    category: string,
    seller: string;
    stock: number;
    ratings?: number;
    createdAt?: string;
    _id: string;
    reviews: ProductReview[];
}

export type ProductContextProps = {
    error: string | null;
    loading: boolean | null;
    updated: boolean;
    setUpdated: (updated: boolean) => void;
    newProduct: (product: NewProductProps) => void;
    uploadProductImages: (formData: FormData, id: string) => void;
    updateProduct: (product: NewProductProps, id: string) => void;
    deleteProduct: (id: string) => void;
    postReview: (reviewData: { rating: number, comment: string, productId: string }) => void;
    clearErrors: () => void;
}

export interface CartItemProps {
    product: string;
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

export interface OrderContextProps {
    error: string | null;
    loading: boolean | null;
    updated: boolean | null;
    canReview: boolean;
    setUpdated: (updated: boolean) => void;
    updateOrder: (id: string, orderData: { orderStatus: string }) => void;
    deleteOrder: (id: string) => void;
    canUserReview: (id: string) => void;
    clearErrors: () => void;
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
    role: string | "user";
    createdAt: string;
    _id: string;
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

export interface userData {
    name: string;
    email: string;
    role: string;
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
    updateUser: (id: string, userData: userData) => void;
    deleteUser: (id: string) => void;
    addNewAddress: (address: userAddress) => void;
    updateAddress: (id: string, address: userAddress) => void;
    deleteAddress: (id: string) => void;
    clearErrors: () => void;
}