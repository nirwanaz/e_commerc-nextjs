import Orders from '@/components/admin/Orders';
import { getCookieName } from '@/helpers/helpers';
import axios from 'axios';
import { cookies } from 'next/headers';
import queryString from 'query-string';
import React from 'react'

const getOrders = async (searchParams: { page: number}) => {
    const nextCookies = cookies();

    const cookieName = getCookieName();

    const nextAuthSessionToken = nextCookies.get(cookieName);

    const urlParams = {
        page: searchParams.page || 1,
    }

    const searchQuery = queryString.stringify(urlParams);

    const { data } = await axios.get(`${process.env.API_URL}/api/admin/orders?${searchQuery}`, {
        headers: {
            Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        }
    })

    return data;
}

const AdminOrdersPage = async ({ searchParams }: any) => {
    const orders = await getOrders(searchParams);

    return <Orders orders={orders} />
}

export default AdminOrdersPage