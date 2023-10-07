import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from 'react-simple-star-rating';

import { CartContextProps, ProductProps } from "@/interfaces";
import { CartContext } from "@/context/CartContext";

const ProductItem = ({ product }: { product: ProductProps }) => {
	const { addItemToCart } = useContext(CartContext) as CartContextProps;

	const addToCartHandler = () => {
		addItemToCart({
			product: product._id,
			name: product.name,
			price: product.price,
			image: product.images[0]?.url,
			stock: product.stock,
			seller: product.seller,
			quantity: 1
		})
	}
	
	return (
		<article className="border border-gray-200 overflow-hidden bg-white shadow-sm rounded mb-5">
			<div className="flex flex-col md:flex-row">
				<div className="md:w-1/4 flex p-3">
					<div className="relative w-4/5 h-4/6">
						<Image
							src={
								product?.images[0]
									? product?.images[0].url
									: "/images/default_product.png"
							}
							alt="product anme"
							height={240}
							width={240}
						/>
					</div>
				</div>

				<div className="md:w-2/4">
					<div className="p-4">
						<Link
							href={`/product/${product._id}`}
							className="hover:text-blue-600"
						>
							{product.name}
						</Link>
						<div className="flex flex-wrap items-center space-x-2 mb-2">
							<div className="ratings">
								<div className="my-1">
									<Rating
										initialValue={product.ratings || 5}
										allowFraction
										readonly
										SVGstyle={{ display: "inline" }}
										showTooltip
										size={20}
									/>
								</div>
							</div>
						</div>
						<p className="text-gray-500 mb-2">
							{product?.description.substring(0, 150)}...
						</p>
					</div>
				</div>
				<div className="md:w-1/4 border-t lg:border-t-0 lg:border-l border-gray-200">
					<div className="p-5">
						<span className="text-xl font-semibold text-black">
							${product?.price}
						</span>

						<p className="text-green-500">Free Shipping</p>
						<div className="my-3">
							<button
								type="button"
								className="px-4 py-2 inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 cursor-pointer"
								onClick={addToCartHandler}
							>
								{" "}
								Add to Cart{" "}
							</button>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default ProductItem;
