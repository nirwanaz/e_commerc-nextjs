import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { getAddresses, newAddress } from "@/backend/controllers/addressController";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { isAuthenticatedUser } from "@/backend/middleware/auth";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

router
    .use(isAuthenticatedUser)
    .get(getAddresses)
    .post(newAddress);

export default router.handler({
    onError: errors
});