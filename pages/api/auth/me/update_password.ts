import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import { updatePassword } from "@/backend/controllers/authController";
import errors from "@/backend/middleware/errors";
import { isAuthenticatedUser } from "@/backend/middleware/auth";
import { log } from "console";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser)
    .put(updatePassword)

export default router.handler({
    onError: errors
});