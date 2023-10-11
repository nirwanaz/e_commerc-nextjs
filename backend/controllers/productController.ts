import { log } from "console";
import Product from "../models/products";
import APIFilters from "../utils/APIFIlters";
import { cloudinary, uploads } from "../utils/cloudinary";
import fs from "fs";
import ErrorHandler from "../utils/errorHandler";
import { UploadApiErrorResponse } from "cloudinary";
import { ProductReview } from "@/interfaces";

export const newProduct = async (req: any, res: any) => {
	req.body.user = req.user._id;

	const product = await Product.create(req.body);

	res.status(200).json({
		product,
	});
};

export const uploadProductImages = async (req: any, res: any, next: any) => {
	const productId = req.query.id;

	if (!productId) {
		return next(new ErrorHandler({
			message: "Invalid Product ID",
			statusCode: 400,
		}));
	}

	let product = await Product.findById(req.query.id);

	if (!product) {
		return next(new ErrorHandler({
			message: "Product not found",
			statusCode: 404
		}));
	}

	const urls = [];
	const files = req.files;

	if (files.length > 0) {
		const uploader = async (path: string) => {
			try {
				return await uploads(path, "buyitnow/products");
			} catch (error) {
				log("error uploader");
				const CloudinaryError = error as UploadApiErrorResponse;

				return next(new ErrorHandler({
					message: CloudinaryError.message,
					statusCode: CloudinaryError.http_code
				}));
			}
		}

		for (const file of files) {
			const { path } = file;
			const imgUrl = await uploader(path);
			urls.push(imgUrl);
			fs.unlinkSync(path);
		}

		product = await Product.findByIdAndUpdate(productId, { images: urls });

		res.status(200).json({
			data: urls,
			product,
		})

	}

	return next(new ErrorHandler({
		message: "Images not found",
		statusCode: 400
	}));

}

export const getProducts = async (req: any, res: any) => {

    const resPerPage = 3;
    const productsCount = await Product.countDocuments();

	const apiFilters = new APIFilters(Product.find(), req.query).search().filter();

	let products = await apiFilters?.query;
    const filteredProductsCount = products.length;

    apiFilters?.pagination(resPerPage);

    products = await apiFilters?.query.clone()

	res.status(200).json({
        productsCount,
        resPerPage,
        filteredProductsCount,
		products,
	});
};

export const getProduct = async (req: any, res: any, next: any) => {
	const product = await Product.findById(req.query.id);

	if (!product) {
		return next(new ErrorHandler({
			message: "Product not found",
			statusCode: 404
		}));
	}

	res.status(200).json({
		product,
	});
};

export const updateProduct = async (req: any, res: any, next: any) => {
	const productId = req.query.id;

	if (!productId) {
		return next(new ErrorHandler({
			message: "Invalid product ID",
			statusCode: 400
		}));
	}

	let product = await Product.findById(productId);

	if (!product) {
		return next(new ErrorHandler({
			message: "Product not found",
			statusCode: 404
		}));
	}

	product = await Product.findByIdAndUpdate(productId, req.body);

	res.status(200).json({
		product,
	});
}

export const deleteProduct = async (req: any, res: any, next: any) => {
	const productId = req.query.id;

	if (!productId) {
		return next(new ErrorHandler({
			message: "Invalid product ID",
			statusCode: 400
		}));
	}

	let product = await Product.findById(productId);

	if (!product) {
		return next(new ErrorHandler({
			message: "Product not found",
			statusCode: 404
		}));
	}

	// Deleting images associated with the product
	for (let i = 0; i < product.images.length; i++) {
		const res = await cloudinary.uploader.destroy(
			product.images[i].public_id
		);
	}

	await product.deleteOne();

	res.status(200).json({
		success: true,
	})
}

export const createProductReview = async (req: any, res: any, next: any) => {
	const { rating, comment, productId } = req.body;

	const review = {
		user: req?.user?._id,
		rating: Number(rating),
		comment,
	}

	let product = await Product.findById(productId);

	if (!product) {
		return next(new ErrorHandler({
			message: "Product not found",
			statusCode: 404
		}));
	}

	const isReviewed = product?.reviews?.find(
		(r: any) => r.user.toString() === req.user._id.toString()
	);

	if (isReviewed) {
		product?.reviews.forEach((review: ProductReview) => {
			if (review.user.toString() === req.user._id.toString()) {
				review.comment = comment;
				review.rating = rating;
			}
		})
	} else {
		product?.reviews.push(review)
	}

	product.ratings = product?.reviews?.reduce((acc: number, item: ProductReview) => item.rating + acc, 0) / product?.reviews.length;

	await product?.save();

	res.status(200).json({
		success: true,
	})
}
