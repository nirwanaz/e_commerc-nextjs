import { createRouter } from "next-connect";
import dbConnect from "@/backend/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import errors from "@/backend/middleware/errors";
import { webhook } from "@/backend/controllers/orderController";

const router = createRouter<NextApiRequest, NextApiResponse>();

dbConnect();

export const config = {
    api: {
        bodyParser: false
    }
}

router
    .post(webhook)

export default router.handler({
    onError: errors
});