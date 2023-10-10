"use client";

import Link from 'next/link'
import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import { FaBars, FaShoppingCart, FaUser } from "react-icons/fa"
import Search from './Search'
import { CartContext } from '@/context/CartContext'
import { CartContextProps, User } from '@/interfaces'
import { useAuth } from '@/context/AuthContext';
import { useSession } from 'next-auth/react';

const Header = () => {
    const { user, setUser } = useAuth()
    const { data } = useSession()

    useEffect(() => {
        if (data) {
            const userData = data.user as User
            setUser(userData)
        }
    }, [data])

    const { cart } = useContext(CartContext) as CartContextProps;

    const cartItems = cart?.cartItems;

  return (
    <header className="bg-white py-2 border-b">
        <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex flex-wrap items-center">
                <div className="flex-shrink-0 mr-5">
                    <Link
                        href={"/"}
                    >
                        <Image
                            src={"/images/logo.png"}
                            height={40}
                            width={120}
                            alt='BuyItNow'
                        />
                    </Link>
                </div>
                <Search />

                <div className="flex items-center space-x-2 ml-auto">
                    <Link
                        href={"/cart"}
                        className="px-3 py-2 inline-block text-center text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300"
                    >
                        <div className="w-5 text-gray-400 inline-block">
                            <FaShoppingCart />
                        </div>
                        <span className="hidden lg:inline ml-1">
                            Cart (<b>{cartItems?.length || 0}</b>)
                        </span>
                    </Link>
                    {!user ? (
                        <Link
                            href={"/login"}
                            className="px-3 py-2 inline-block text-center text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300"
                        >
                            <div className="w-5 text-gray-400 inline-block">
                                <FaUser />
                            </div>
                            <span className="hidden lg:inline ml-1">
                                Sign in
                            </span>
                        </Link>

                    ): (

                        <Link href={"/me"}>
                            <div className="flex items-center mb-4 space-x-3 mt-4 cursor-pointer">
                                <Image
                                    className="w-10 h-10 rounded-full"
                                    src={user?.avatar?.url || "/images/default.png"}
                                    alt='user'
                                    width={20}
                                    height={20}
                                />
                                <div className="space-y-1">
                                    <p>
                                        {user?.name}
                                        <time className="block text-sm text-gray-500 dark:text-gray-400">
                                            {user?.email}
                                        </time>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

                <div className="lg:hidden ml-2">
                    <button
                        type='button'
                        className="bg-white p-3 inline-flex items-center rounded-md text-black hover:bg-gray-200 hover:text-gray-800 border border-transparent"
                    >
                        <span className="sr-only">Open menu</span>
                        <FaBars />
                    </button>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header