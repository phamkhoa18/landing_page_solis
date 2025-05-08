import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Kích hoạt chế độ Strict Mode của React
  swcMinify: true,       // Sử dụng SWC để minify mã nguồn (tăng tốc build)
  images: {
    domains: ['example.com'], // Cho phép tải ảnh từ các domain này
  },
  i18n: {
    locales: ['en', 'vi'],    // Các ngôn ngữ hỗ trợ
    defaultLocale: 'vi',      // Ngôn ngữ mặc định
  },
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;