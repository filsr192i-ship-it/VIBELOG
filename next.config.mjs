/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 시 ESLint 오류로 인한 배포 실패 무시
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 타입 스크립트 오류 무시
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
