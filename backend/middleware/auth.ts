import ErrorHandler from "../utils/errorHandler";
import { User } from "@/interfaces";
import { log } from "console";
import { getToken } from "next-auth/jwt";

const isAuthenticatedUser = async (req: any, res: any, next: any) => {
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
    return (req: any, res: any, next: any) => {
        if (!roles.includes(req.user.role)) {
            const errorhandler = new ErrorHandler({
                message: `Role (${req.user.role}) is not allowed to access this resource`,
                statusCode: 401 
            });

            log("not admin")

            throw errorhandler;
        }

        console.log("authorized");

        return next();
    };
};

export { isAuthenticatedUser, authorizedRoles };