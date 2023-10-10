"use client";

import { useAuth } from '@/context/AuthContext'
import { User } from '@/interfaces';
import Link from 'next/link';
import { useEffect } from 'react'
import { toast } from 'react-toastify';
import CustomPagination from '../layouts/CustomPagination';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

type UsersProps = {
    data: {
        users: User[];
        resPerPage: number;
        usersCount: number;
    }
}

const Users = ({ data }: UsersProps) => {
    const { error, deleteUser, clearErrors } = useAuth();

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearErrors()
        }
    }, [error])

    const deleteHandler = (id: string) => {
        deleteUser(id);
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h1 className="text-3xl my-5 ml-4 font-bold">
                {data?.users?.length} Users
            </h1>
            <table className="w-full text-sm text-left">
                <thead className="text-l text-gray-700 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Role
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.users?.map((user) => (
                        <tr key={user?._id} className="bg-white">
                            <td className="px-6 py-2">{user?.name}</td>
                            <td className="px-6 py-2">{user?.email}</td>
                            <td className="px-6 py-2">{user?.role}</td>
                            <td className="px-6 py-2">
                                <div>
                                    <Link
                                        href={`/admin/users/${user?._id}`}
                                        className="px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                                    >
                                        <i aria-hidden="true">
                                            <FaPencilAlt />
                                        </i>
                                    </Link>
                                    <a
                                        className="px-2 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                                        onClick={() => deleteHandler(user?._id)}
                                    >
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
            {data?.users?.length > data?.resPerPage && (
                <div className="mb-6">
                    <CustomPagination
                        resPerPage={data?.resPerPage}
                        productCount={data?.usersCount}
                    />
                </div>
            )}
        </div>
    )
}

export default Users