import getRawBody from "raw-body";
import Stripe from "stripe";
import Order from "../models/order";
import { CartItemProps } from "@/interfaces";
import APIFilters from "../utils/APIFIlters";
import ErrorHandler from "../utils/errorHandler";

const stripeConfig = {}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string, stripeConfig as Stripe.StripeConfig);

export const getOrders = async (req: any, res: any) => {
    const resPerPage = 2;
    const ordersCount = await Order.countDocuments();

    const apiFilters = new APIFilters(Order.find(), req.query).pagination(resPerPage);

    const orders = await apiFilters.query.find().populate("shippingInfo user");

    res.status(200).json({
        ordersCount,
        resPerPage,
        orders,
    })
}

export const getOrder = async (req: any, res: any, next: any) => {
    const order = await Order.findById(req.query.id).populate("shippingInfo user");

    if (!order) {
        return next(new ErrorHandler({
            message: "No Order found with this ID",
            statusCode: 404,
        }));
    }

    res.status(200).json({
        order,
    });
}

export const myOrders = async (req: any, res: any) => {
    const resPerPage = 2;
    const ordersCount = await Order.countDocuments();

    const apiFilters = new APIFilters(Order.find(), req.query).pagination(resPerPage);

    const orders = await apiFilters.query
        .find({ user: req.user._id })
        .populate("shippingInfo user");

    res.status(200).json({
        ordersCount,
        resPerPage,
        orders
    })
}

export const updateOrder = async (req: any, res: any, next: any) => {
    const orderId = req.query.id;

    if (!orderId) {
        return next(new ErrorHandler({
            message: "Invalid Order ID",
            statusCode: 400,
        }));
    }

    let order = await Order.findById(orderId);

    if (!order) {
        return next(new ErrorHandler({
            message: "No Order found with this ID",
            statusCode: 404,
        }));
    }

    order = await Order.findByIdAndUpdate(orderId, {
        orderStatus: req.body.orderStatus,
    });

    res.status(200).json({
        success: true,
        order,
    });
}

export const deleteOrder = async (req: any, res: any, next: any) => {
    const orderId = req.query.id;

    if (!orderId) {
        return next(new ErrorHandler({
            message: "Invalid Order ID",
            statusCode: 404,
        }));
    }

    let order = await Order.findById(orderId);

    if (!order) {
        return next(new ErrorHandler({
            message: "No Order found with this ID",
            statusCode: 404,
        }));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
    });
}

export const canReview = async (req: any, res: any) => {
    const productId = req.query.productId;

    const orders = await Order.find({
        user: req?.user?._id, 
        "orderItems.product": productId
    });

    let canReview = orders?.length >= 1 ? true : false;

    res.status(200).json({
        canReview,
    });
}

export const checkoutSession = async (req: any, res: any) => {
    const body = req.body;

    const line_items = body?.items?.map((item: CartItemProps) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image],
                    metadata: { productId: item.product },
                },
                unit_amount: item.price * 100,
            },
            tax_rates: ["txr_1NwxnqGun9cYQToJfXoZmrNq"],
            quantity: item.quantity
        };
    });

    const shippingInfo = body?.shippingInfo;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${process.env.API_URL}/me/orders?order_success=true`,
        cancel_url: `${process.env.API_URL}`,
        customer_email: req.user?.email,
        client_reference_id: req.user?._id,
        mode: "payment",
        metadata: { shippingInfo },
        shipping_options: [
            {
                shipping_rate: "shr_1NwxOjGun9cYQToJMVlZcZdY"
            }
        ],
        line_items,
    });

    res.status(200).json({
        url: session.url,
    })
}

interface cartItems {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

async function getCartItems(lineItems: Stripe.Response<Stripe.ApiList<Stripe.LineItem>>) {
    return new Promise((resolve, reject) => {
        let cartItems = [] as cartItems[];

        lineItems?.data?.forEach(async (item) => {
            const product = await stripe.products.retrieve(item.price?.product as string);
            const productId = product.metadata.productId;

            cartItems.push({
                product: productId,
                name: product.name,
                price: Number(item.price?.unit_amount_decimal) / 100,
                quantity: item.quantity || 0,
                image: product.images[0],
            });

            if (cartItems.length === lineItems?.data.length) {
                resolve(cartItems);
            }
        });
    });
}

export const webhook = async (req: any, res: any) => {
    try {
        const rawBody = await getRawBody(req);
        const signature = req.headers["stripe-signature"];

        const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })

            const orderItems = await getCartItems(lineItems) as cartItems[];
            const userId = session.client_reference_id as string;
            const amountPaid = session.amount_total? session.amount_total / 100 : 0;

            const paymentInfo = {
                id: session.payment_intent,
                status: session.payment_status,
                amountPaid,
                taxPaid: session.total_details ? session.total_details.amount_tax / 100 : 0,
            };

            const orderData = {
                user: userId,
                shippingInfo: session.metadata?.shippingInfo,
                paymentInfo,
                orderItems,
            };

            const order = await Order.create(orderData);
            res.status(201).json({ success: true });
        }
    } catch (error) {
        console.log(error);
    }
}