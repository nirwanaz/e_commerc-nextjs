import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { isAuthenticatedUser } from "@/backend/middleware/auth";
import { canReview } from "@/backend/controllers/orderController";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser)
    .get(canReview);

export default router.handler({
    onError: errors
});