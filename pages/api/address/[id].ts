import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { getAddress, updateAddress, deleteAddress } from "@/backend/controllers/addressController";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { isAuthenticatedUser } from "@/backend/middleware/auth";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser)
    .get(getAddress)
    .put(updateAddress)
    .delete(deleteAddress)

export default router.handler({
    onError: errors
});