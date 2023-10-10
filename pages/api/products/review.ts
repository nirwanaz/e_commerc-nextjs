import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { isAuthenticatedUser } from "@/backend/middleware/auth";
import { createProductReview } from "@/backend/controllers/productController";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser)
    .put(createProductReview);

export default router.handler({
    onError: errors
});