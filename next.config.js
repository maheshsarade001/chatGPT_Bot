/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API: process.env.API,
    APIKEY: process.env.APIKEY,
  },
};

module.exports = nextConfig;
