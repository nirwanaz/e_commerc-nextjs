import ErrorHandler from "../utils/errorHandler";
import { User } from "@/interfaces";
import { log } from "console";
import { getToken } from "next-auth/jwt";

const isAuthenticatedUser = async (req, res, next) => {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    
    if (!session) {
        const errorhandler = new ErrorHandler({
            message: "Login first to access this route",
            statusCode: 401 
        });

        console.log("No session");
        
        throw errorhandler;
    }

    req.user = session.user as User;

    console.log("have session");
    
    await next();
}

const authorizedRoles = (...roles: any) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const errorhandler = new ErrorHandler({
                message: `Role (${req.user.role}) is not allowed to access this resource`,
                statusCode: 401 
            });

            log("not admin")

            throw errorhandler;
        }

        next()
    };
};

export { isAuthenticatedUser, authorizedRoles };