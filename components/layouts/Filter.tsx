import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { getPriceQueryParams } from "@/helpers/helpers";

const Categories = ["Electronics", "Laptops", "Toys", "Office", "Beauty"];

const Filter = () => {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    const router = useRouter();

	let queryParams: URLSearchParams | null = null;

	const handleClick = (target: HTMLInputElement) => {
        if (typeof window !== "undefined") {
			queryParams = new URLSearchParams(window.location.search);

            const checkboxes = document.getElementsByName(target.name) as NodeListOf<HTMLInputElement>

            checkboxes.forEach((item) => {
                if (item !== target) item.checked = false
            })

            if (target.checked === false) {
                // Delete filter from query
                queryParams.delete(target.name)
            } else {
                // Set filter in the query
                if (queryParams.has(target.name)) {
                    queryParams.set(target.name, target.value);
                } else {
                    queryParams.append(target.name, target.value)
                }
            }

            const path = window.location.pathname + "?" + queryParams.toString();
            router.push(path)
        }

    };

    function handleButtonClick() {
        if (typeof window !== "undefined") {
            queryParams = new URLSearchParams(window.location.search);

            queryParams = getPriceQueryParams(queryParams, "min", min);
            queryParams = getPriceQueryParams(queryParams, "max", max);

            const path = window.location.pathname + "?" + queryParams?.toString();
            router.push(path)
        }
    }

	function checkHandler(checkBoxType: string, checkBoxValue: string) {
		if (typeof window !== "undefined") {
			queryParams = new URLSearchParams(window.location.search);
			const value = queryParams.get(checkBoxType);

			if (checkBoxValue === value) return true;
		}

        return false;
	}
	return (
		<aside className="md:w-1/3 lg:w-1/4 px-4">
			<button type="button" className="md:hidden mb-5 w-full text-center px-4 py-2 inline-block text-lg text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-600">
				Filter by
			</button>
			<div className="hidden md:block px-6 py-4 border border-gray-200 bg-white rounded shadow-sm">
				<h3 className="font-semibold mb-2 dark:text-gray-700">Price ($)</h3>
				<div className="grid md:grid-cols-3 gap-x-2">
					<div className="mb-4">
						<input
							name="min"
							className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
							type="number"
							placeholder="Min"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<input
							name="max"
							className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
							type="number"
							placeholder="Max"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<button className="px-1 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700" onClick={handleButtonClick}>
							Go
						</button>
					</div>
				</div>
			</div>

			<div className="hidden md:block px-6 py-4 border border-gray-200 bg-white rounded shadow-sm">
				<h3 className="font-semibold mb-2 dark:text-gray-700">Category</h3>

				<ul className="space-y-1">
					{Categories?.map((category) => (
						<li key={category}>
							<label className="flex items-center">
								<input
									type="checkbox"
									name="category"
									value={category}
									className="h-4 w-4"
									defaultChecked={checkHandler(
										"category",
										category
									)}
                                    onClick={(e) => handleClick(e.target as HTMLInputElement)}
								/>
								<span className="ml-2 text-gray-500">
									{category}
								</span>
							</label>
						</li>
					))}
				</ul>
				<hr className="my-4" />

				<h3 className="font-semibold mb-2 dark:text-gray-700">Ratings</h3>
				<ul className="space-y-1">
					<li>
						{[5, 4, 3, 2, 1].map((rating) => (
							<label key={rating} className="flex items-center">
								<input
									type="checkbox"
									name="ratings"
									value={rating}
									className="h-4 w-4"
									defaultChecked={checkHandler(
										"ratings",
										`${rating}`
									)}
                                    onClick={(e) => handleClick(e.target as HTMLInputElement)}
								/>
								<span className="ml-2 text-gray-500">
									{" "}
									<Rating
										initialValue={rating}
										allowFraction
										size={20}
										fillColor="#ffb829"
										SVGstyle={{ display: "inline" }}
										allowHover={false}
										readonly
									/>{" "}
								</span>
							</label>
						))}
					</li>
				</ul>
			</div>
		</aside>
	);
};

export default Filter;
