import axios from "axios";
import ProductDetails from "@/components/products/ProductDetails";

const getProductDetails = async (id: string) => {
    const { data } = await axios.get(`${process.env.API_URL}/api/products/${id}`);

    return data?.product;
}

const ProductDetailsPage = async ({ params }) => {
    const product = await getProductDetails(params.id);

    return <ProductDetails product={product}/>
}

export default ProductDetailsPage