/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'assets.brandfolder.com',
      'randomuser.me',
      'bloomberg.com',
      'techcrunch.com',
      'reuters.com',
      'theverge.com',
      'forbes.com',
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_CLIENT_NAME: process.env.NEXT_PUBLIC_CLIENT_NAME,
  },
};
