import Shipping from "@/components/cart/Shipping";
import { getCookieName } from "@/helpers/helpers";
import axios from "axios";
import { cookies } from "next/headers";
import React from "react";

const getAddresses = async () => {
	const nextCookies = cookies();

	const cookieName = getCookieName();

	const nextAuthSessionToken = nextCookies.get(cookieName);

	const { data } = await axios.get(`${process.env.API_URL}/api/address`, {
		headers: {
			Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
		},
	});

	return data?.addresses;
};

const ShippingPage = async () => {
	const addresses = await getAddresses();
	return <Shipping addresses={addresses} />;
};

export default ShippingPage;
