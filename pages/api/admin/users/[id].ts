import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { authorizedRoles, isAuthenticatedUser } from "@/backend/middleware/auth";
import { deleteUser, getUser, updateUser } from "@/backend/controllers/authController";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser, authorizedRoles("admin"))
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

export default router.handler({
    onError: errors
});