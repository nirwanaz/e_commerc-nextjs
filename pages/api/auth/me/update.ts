import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import { updateProfile } from "@/backend/controllers/authController";
import errors from "@/backend/middleware/errors";
import { isAuthenticatedUser } from "@/backend/middleware/auth";
import upload from "@/backend/utils/multer";
import { log } from "console";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

export const config = {
    api: {
        bodyParser: false,
    }
}

const uploadMiddleware = upload.array("image");

router
    .use(isAuthenticatedUser)
    .use(uploadMiddleware as any)
    .put(updateProfile)

export default router.handler({
    onError: errors
});