import UpdateProduct from '@/components/admin/UpdateProduct';
import axios from 'axios';
import React from 'react'

const getProduct = async (id: string) => {
    const { data } = await axios.get(`${process.env.API_URL}/api/products/${id}`);

    return data;
}

const HomePage = async ({ params }: { params: { id: string } }) => {
    const data = await getProduct(params.id);

    return <UpdateProduct data={data.product} />
}

export default HomePage