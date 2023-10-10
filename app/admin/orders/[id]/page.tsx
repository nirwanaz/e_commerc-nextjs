import UpdateOrder from '@/components/admin/UpdateOrder';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react'

const getOrder = async (id: string) => {
    const nextCookies = cookies();

    const nextAuthSessionToken = nextCookies.get("next-auth.session-token");

    const { data } = await axios.get(`${process.env.API_URL}/api/admin/orders/${id}`, {
        headers: {
            Cookie: `next-auth.session-token=${nextAuthSessionToken?.value}`,
        }
    })

    return data;
}

const AdminOrderDetailPage = async ({ params }: { params: { id: string } }) => {
    const data = await getOrder(params?.id);

    return <UpdateOrder order={data?.order} />
}

export default AdminOrderDetailPage