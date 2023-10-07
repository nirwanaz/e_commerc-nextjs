"use client";

import { CartContext } from "@/context/CartContext";
import { CartContextProps, OrderProps } from "@/interfaces";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import CustomPagination from "../layouts/CustomPagination";
import OrderItem from "./OrderItem";

interface ListOrderProps {
    orders: {
        orders: OrderProps[];
        resPerPage: number;
        ordersCount: number;
    }
}

const ListOrders = ({ orders }: ListOrderProps) => {
	const { clearCart } = useContext(CartContext) as CartContextProps;
	const params = useSearchParams();
	const router = useRouter();

	const orderSuccess = params?.get("order_success");

	useEffect(() => {
		if (orderSuccess === "true") {
			clearCart();
			router.replace("/me/orders");
		}
	}, []);

	return (
		<>
			<h3 className="text-xl font-semibold mb-5">Your Orders</h3>
			{orders?.orders?.map((order) => (
				<OrderItem key={order._id} order={order} />
			))}

			<CustomPagination
				resPerPage={orders?.resPerPage}
				productCount={orders?.ordersCount}
			/>
		</>
	);
};

export default ListOrders;
