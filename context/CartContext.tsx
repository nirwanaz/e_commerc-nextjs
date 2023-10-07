"use client";

import { CartContextProps, CartItemProps, CartProps } from "@/interfaces";
import { useRouter } from "next/navigation";
import { FC, ReactNode, createContext, useEffect, useState } from "react";

export const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
	children: ReactNode;
}

const CartProvider: FC<CartProviderProps> = ({ children }) => {
	const [cart, setCart] = useState<CartProps>({ cartItems: [] });

	const router = useRouter();

	useEffect(() => {
		setCartToState();
	}, []);

	const setCartToState = () => {
		const storedCart = localStorage.getItem("cart");
		if (storedCart) {
			setCart(JSON.parse(storedCart));
		}
	};

	const addItemToCart = ({
		product,
		name,
		price,
		image,
		stock,
		seller,
		quantity = 1,
	}: CartItemProps) => {
		const item = {
			product,
			name,
			price,
			image,
			stock,
			seller,
			quantity,
		};

		const isItemExist = cart?.cartItems?.find(
			(i) => i.product === item.product
		);

		let newCartItems;

		if (isItemExist) {
			newCartItems = cart?.cartItems?.map((i) =>
				i.product === isItemExist.product ? item : i
			);
		} else {
			newCartItems = [...(cart?.cartItems || []), item];
		}

		const newCart = { cartItems: newCartItems };
        // console.log("new Cart", newCart);

		localStorage.setItem("cart", JSON.stringify(newCart));
		setCartToState();
	};

	const deleteItemFromCart = (id: string | number) => {
		const newCartItems = cart?.cartItems?.filter((i) => i.product !== id);

		const newCart = { cartItems: newCartItems };

		localStorage.setItem("cart", JSON.stringify(newCart));
		setCartToState();
	};

	const saveOnCheckout = ({ amount, tax, totalAmount }: { amount: number; tax: string; totalAmount: string; }) => {
		const checkoutInfo = {
			amount,
			tax,
			totalAmount
		}

		const newCart = {...cart, checkoutInfo};

		localStorage.setItem("cart", JSON.stringify(newCart));
		setCartToState();
		router.push("/shipping");
	}

	const clearCart = () => {
		localStorage.removeItem("cart");
		setCartToState();
	}

	return (
		<CartContext.Provider
			value={{
				cart,
				addItemToCart,
				saveOnCheckout,
				deleteItemFromCart,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export default CartProvider;
