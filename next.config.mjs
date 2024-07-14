/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/create-escrow",
        permanent: true, // 301 yönlendirme için true, 302 yönlendirme için false
      },
    ];
  },
};

export default nextConfig;
