import ListOrders from "@/components/orders/ListOrders";
import { getCookieName } from "@/helpers/helpers";
import axios from "axios";
import { cookies } from "next/headers";
import queryString from "query-string";
import React from "react";

const getOrders = async (searchParams: any) => {
	const nextCookies = cookies();

	const cookieName = getCookieName();

	const nextAuthSessionToken = nextCookies.get(cookieName);

	const urlParams = {
		page: searchParams.page || 1,
	};

	const searchQuery = queryString.stringify(urlParams);

	const { data } = await axios.get(
		`${process.env.API_URL}/api/orders/me?${searchQuery}`,
		{
			headers: {
				Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
			},
		}
	);

	return data;
};

const MyOrdersPage = async ({
	searchParams,
}: {
	searchParams: URLSearchParams;
}) => {
	const orders = await getOrders(searchParams);

	return <ListOrders orders={orders} />;
};

export default MyOrdersPage;
