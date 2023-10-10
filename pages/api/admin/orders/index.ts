import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { authorizedRoles, isAuthenticatedUser } from "@/backend/middleware/auth";
import { getOrders } from "@/backend/controllers/orderController";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser, authorizedRoles("admin"))
    .get(getOrders);

export default router.handler({
    onError: errors
});