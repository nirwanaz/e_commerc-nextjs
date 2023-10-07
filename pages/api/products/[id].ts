import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { getProduct } from "@/backend/controllers/productController";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(async (req, res, next) => {
        const start = Date.now();
        await next();
        const end = Date.now();
        console.log(`Request took ${end - start}ms`);
        
    })
    .get(getProduct)

export default router.handler({
    onError: errors
});