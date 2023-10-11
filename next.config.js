/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: "http://localhost:3000",
        DB_URI: "mongodb://localhost:27017/buyitnow",

        CLOUD_NAME: "dl2uzcyhl",
        CLOUDINARY_API_KEY: "",
        CLOUDINARY_API_SECRET: "",

        STRIPE_PRIVATE_KEY: "",
        STRIPE_WEBHOOK_SECRET: "",

        NEXTAUTH_SECRET: "codingwithzeroxone",
    },
    images: {
        domains: ["res.cloudinary.com"]
    }
};

module.exports = nextConfig
