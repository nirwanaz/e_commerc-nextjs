import { log } from "console";
import Product from "../models/products";
import APIFilters from "../utils/APIFIlters";
import { uploads } from "../utils/cloudinary";
import fs from "fs";

export const newProduct = async (req, res, next) => {
	req.body.user = req.user._id;

	const product = await Product.create(req.body);

	res.status(200).json({
		product,
	});
};

export const uploadProductImages = async (req, res, next) => {
	try {
		const productId = req.query.id;

		if (!productId) {
			res.status(400).json({ error: "Invalid product ID" });
		}

		let product = await Product.findById(req.query.id);

		if (!product) {
			res.status(404).json({error: "Product not found"});
		}

		const uploader = async (path) => {
			try {
				return await uploads(path, "buyitnow/products");
			} catch (error) {
				log("error uploader");
				return undefined;
			}
		}

		const urls = [];
		const files = req.files;

		log("files", files);

		if (files.length > 0) {
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

		res.status(400).json({ error: "Images not found" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}

}

export const getProducts = async (req, res, next) => {

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

export const getProduct = async (req, res, next) => {
	const product = await Product.findById(req.query.id);

	if (!product) {
		res.status(404).json({
			error: "Product not found",
		});
	}

	res.status(200).json({
		product,
	});
};
