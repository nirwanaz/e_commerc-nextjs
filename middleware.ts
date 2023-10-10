import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { User } from "./interfaces";

export default withAuth(
	async function middleware(req) {
		// authorize roles
		const url = req.nextUrl.pathname;
		const user = req?.nextauth?.token?.user as User;
		const userRole = user.role

		if (url?.startsWith("/admin") && userRole !== "admin") {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// return NextResponse.next()
	},
	{
		callbacks: {
			authorized: ({ token }) => {
				if (!token) return false;
				return true
			},
		},
	}
);

export const config = {
	matcher: [
		"/admin/:path*",
		"/me/:path*",
		"/shipping",
	],
};
