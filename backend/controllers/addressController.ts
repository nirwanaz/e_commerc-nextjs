import { log } from "console";
import Address from "../models/address"
import ErrorHandler from "../utils/errorHandler";

export const newAddress = async (req: any, res: any) => {
    req.body.user = req.user._id;

    const address = await Address.create(req.body);

    res.status(200).json({
        address
    });
};

export const getAddresses = async (req: any, res: any) => {
    const addresses = await Address.find({ user: req.user._id });

    res.status(200).json({
        addresses
    })
};

export const getAddress = async (req: any, res: any) => {
    const address = await Address.findById(req.query.id);

    if (!address) {
        const errorhandler = new ErrorHandler({
            message: "Address not found",
            statusCode: 404
        });

        throw errorhandler;
    }

    res.status(200).json({
        address,
    });
};

export const updateAddress = async (req: any, res: any) => {
    let address = await Address.findById(req.query.id);

    if (!address) {
        const errorhandler = new ErrorHandler({
            message: "Address not found",
            statusCode: 404
        });

        throw errorhandler;
    }

    address = await Address.findByIdAndUpdate(req.query.id, req.body);

    res.status(200).json({
        address,
    });
};

export const deleteAddress = async (req: any, res: any) => {
    let address = await Address.findById(req.query.id);

    if (!address) {
        const errorhandler = new ErrorHandler({
            message: "Address not found",
            statusCode: 404
        });

        throw errorhandler;
    }

    await address.deleteOne();

    res.status(200).json({
        success: true
    })
}