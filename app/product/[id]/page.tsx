import axios from "axios";
import ProductDetails from "@/components/products/ProductDetails";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

const getProductDetails = async (id: string) => {
    const { data } = await axios.get(`${process.env.API_URL}/api/products/${id}`);

    return data?.product;
}

const ProductDetailsPage = async ({ params }: { params: { id: string } }) => {
    const isValidId = mongoose.isValidObjectId(params?.id);

    if (isValidId) redirect("/");

    const product = await getProductDetails(params.id);

    return <ProductDetails product={product}/>
}

export default ProductDetailsPage