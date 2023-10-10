"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

const userSidebars = [
	{name: "your_profile", url: "/me"},
	{name: "orders", url: "/me/orders"},
	{name: "update_profile", url: "/me/update"},
	{name: "update_password", url: "/me/update_password"},
];

const adminSidebars = [
	{name: "new_product_", url: "/admin/products/new"},
	{name: "all_products_", url: "/admin/products"},
	{name: "all_orders_", url: "/admin/orders"},
	{name: "all_users_", url: "/admin/users"},
]

const Sidebar = () => {
	const { user } = useAuth();

	const logoutHandler = () => {
		signOut();
	};

	return (
		<aside className="md:w-1/3 lg:w-1/4 px-4">
			<ul className="sidebar">
				{user?.role === "admin" && (
					<>
						{
							adminSidebars.map((adminSidebar, index) => (
								<li key={index}>
									{" "}
									<Link
										href={adminSidebar.url}
										className="block px-3 py-2 text-gray-800 dark:text-white hover:bg-blue-100 hover:text-blue-500 rounded-md capitalize"
									>
										{ adminSidebar.name.replaceAll("_"," ") }
										<span className="text-red-500">(Admin)</span>
									</Link>
								</li>
							))
						}

						<hr />
					</>
				)}

				{
					userSidebars.map((userSidebar, index) => (
						<li key={index}>
							{" "}
							<Link
								href={userSidebar.url}
								className="block px-3 py-2 text-gray-800 dark:text-white hover:bg-blue-100 hover:text-blue-500 rounded-md capitalize"
							>
								{ userSidebar.name.replace("_", " ") }
							</Link>
						</li>
					))
				}

				<li>
					{" "}
					<a
						className="block px-3 py-2 text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer"
						onClick={logoutHandler}
					>
						Logout
					</a>
				</li>
			</ul>
		</aside>
	);
};

export default Sidebar;
