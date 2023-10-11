/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: "http://localhost:3000",
        DB_LOCAL_URI: "mongodb://localhost:27017/buyitnow",
        DB_URI: "mongodb+srv://berlin:rahasia@buyitnow.kazmnjb.mongodb.net/?retryWrites=true&w=majority",

        CLOUD_NAME: "dl2uzcyhl",
        CLOUDINARY_API_KEY: "999747855934663",
        CLOUDINARY_API_SECRET: "x8O_C8eYNvYzMgQd8rJXn6HlVLc",

        STRIPE_PRIVATE_KEY: "sk_test_51Nwx1WGun9cYQToJcDIGX1AWAUbc51Rah6gj6wQxcCU9UrVUz9dprJWot5QLGd8C3YdG7t0hjzGZHmTKIV6zVXBA009uoJ2w05",
        STRIPE_WEBHOOK_SECRET: "whsec_fc9e2910950a05e4dddd416cdaf629fb1346f5b0ef5965f3a097bed7cd15e94f",

        NEXTAUTH_SECRET: "codingwithzeroxone",
    },
    images: {
        domains: ["res.cloudinary.com"]
    }
};

module.exports = nextConfig
