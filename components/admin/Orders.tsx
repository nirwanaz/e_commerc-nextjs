"use client";

import { useEffect } from 'react'
import CustomPagination from '../layouts/CustomPagination'
import Link from 'next/link';
import { OrderProps } from '@/interfaces';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useOrder } from '@/context/OrderContext';

type OrdersProps = {
    orders: {
        orders: OrderProps[];
        ordersCount: number;
        resPerPage: number;
    }
}

const Orders = ({ orders }: OrdersProps) => {
    const { deleteOrder, error, clearErrors } = useOrder();

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearErrors();
        }
    }, [error]);

    const deleteHandler = (id: string) => {
        deleteHandler(id)
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h1 className="text-3xl my-5 ml-4 font-bold">
                {orders?.ordersCount} Orders
            </h1>
            <table className="w-full text-sm text-left">
                <thead className="text-l text-gray-700 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Amount Paid
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.orders?.map((order) => (
                        <tr key={order._id} className="bg-white">
                            <td className="px-6 py-2">{order?._id}</td>
                            <td className="px-6 py-2">${order?.paymentInfo?.amountPaid}</td>
                            <td className="px-6 py-2">{order?.orderStatus}</td>
                            <td className="px-6 py-2">
                                <div>
                                    <Link
                                        href={`/admin/orders/${order?._id}`}
                                        className="px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                                    >
                                        <i aria-hidden="true">
                                            <FaPencilAlt />
                                        </i>
                                    </Link>
                                    <a className="px-2 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => deleteHandler(order?._id as string)}>
                                        <i aria-hidden="true">
                                            <FaTrash />
                                        </i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mb-6">
                <CustomPagination
                    resPerPage={orders?.resPerPage}
                    productCount={orders?.ordersCount}
                />
            </div>
        </div>
    )
}

export default Orders