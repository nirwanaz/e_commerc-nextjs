"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UpdateProfile = () => {
	const { user, error, loading, updateProfile, clearErrors } = useAuth();

	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [avatar, setAvatar] = useState<string | Blob>("");
	const [avatarPreview, setAvatarPreview] = useState<string>("");

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setAvatarPreview(user.avatar?.url as string || "/images/default.png")
		}

		if (error) {
			toast.error(error);
			clearErrors();
		}
	}, [error, user]);

	const submitHandler = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		formData.set("name", name);
		formData.set("email", email);
		formData.set("image", avatar);

		updateProfile(formData);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result as string);
                }
            };

            setAvatar(file);
            reader.readAsDataURL(file);

        }
	};

	return (
		<>
			<div
				style={{ maxWidth: "480px" }}
				className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded bg-white"
			>
				<form onSubmit={submitHandler}>
					<h2 className="mb-5 text-2xl font-semibold">
						Update Profile
					</h2>

					<div className="mb-4">
						<label className="block mb-1"> Full Name </label>
						<input
							className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
							type="text"
							placeholder="Type your name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-1"> Email </label>
						<input
							className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
							type="text"
							placeholder="Type your email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-1"> Avatar </label>
						<div className="mb-4 flex flex-col md:flex-row">
							<div className="flex items-center mb-4 space-x-3 mt-4 cursor-pointer md:w-1/5 lg:w-1/4">
								<Image
									className="w-14 h-14 rounded-full"
									src={avatarPreview}
									alt="profile"
									width={56}
									height={56}
								/>
							</div>
							<div className="md:w-2/3 lg:w-80">
								<input
									className="form-control block w-full px-2 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-6"
									type="file"
									id="formFile"
									onChange={onChange}
								/>
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
						disabled={loading ? true : false}
					>
						{loading ? "Updating..." : "Update"}
					</button>
				</form>
			</div>
		</>
	);
};

export default UpdateProfile;
