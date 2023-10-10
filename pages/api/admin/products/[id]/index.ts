import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { deleteProduct, updateProduct } from "@/backend/controllers/productController";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { authorizedRoles, isAuthenticatedUser } from "@/backend/middleware/auth";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser, authorizedRoles("admin"))
    .put(updateProduct)
    .delete(deleteProduct)

export default router.handler({
    onError: errors
});