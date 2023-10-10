import { uploadProductImages } from "@/backend/controllers/productController";
import dbConnect from "@/backend/db.config";
import { authorizedRoles, isAuthenticatedUser } from "@/backend/middleware/auth";
import errors from "@/backend/middleware/errors";
import upload from "@/backend/utils/multer";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";


const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

export const config = {
    api: {
        bodyParser: false,
    }
}

const uploadMiddleware = upload.array("image");

router
    .use(isAuthenticatedUser, authorizedRoles("admin"))
    .use(uploadMiddleware as any)
    .post(uploadProductImages)

export default router.handler({
    onError: errors
});