import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { newProduct } from "@/backend/controllers/productController";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { authorizedRoles, isAuthenticatedUser } from "@/backend/middleware/auth";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser)
    .use(authorizedRoles("admin"))
    .post(newProduct);

export default router.handler({
    onError: errors
});