/** @type {import('next').NextConfig} */
const nextConfig = { eslint: {
    dirs: ['app', 'components','hooks', 'lib']  // Optional: specify directories to lint
  }};

export default nextConfig;
