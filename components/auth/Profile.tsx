"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";
import UserAddresses from "../user/UserAddresses";
import { userAddress } from "@/interfaces";
import Image from "next/image";

const Profile = ({ addresses }: { addresses: userAddress[] }) => {
	const { user } = useAuth();
	return (
		<>
			<figure className="flex items-start sm:items-center">
				<div className="relative">
					<Image
						className="w-16 h-16 rounded-full mr-4"
						src={
							user?.avatar?.url || "/images/default.png"
						}
						alt={user?.name || "profile"}
						width={64}
						height={64}
					/>
				</div>
				<figcaption>
					<h5 className="font-semibold text-lg">{user?.name}</h5>
					<p>
						<b>Email:</b> {user?.email} | <b>Joined On:</b>
						{user?.createdAt.substring(0, 10)}
					</p>
				</figcaption>
			</figure>

			<hr className="my-4" />

			<UserAddresses addresses={addresses} />

			<Link href="/address/new">
				<button className="px-4 py-2 inline-block text-blue-600 border border-gray-300 rounded-md hover:bg-gray-100">
					<i className="mr-1 fa fa-plus"></i> Add new address
				</button>
			</Link>

			<hr className="my-4" />
		</>
	);
};

export default Profile;
