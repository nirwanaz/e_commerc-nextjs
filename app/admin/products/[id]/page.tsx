import UpdateProduct from '@/components/admin/UpdateProduct';
import axios from 'axios';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

const getProduct = async (id: string) => {
    const { data } = await axios.get(`${process.env.API_URL}/api/products/${id}`);

    return data;
}

const HomePage = async ({ params }: { params: { id: string } }) => {
    const isValidId = mongoose.isValidObjectId(params?.id);

    if (!isValidId) return redirect("/");

    const data = await getProduct(params.id);

    return <UpdateProduct data={data.product} />
}

export default HomePage