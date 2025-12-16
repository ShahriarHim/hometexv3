import nextIntl from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const withNextIntl = nextIntl('./next-intl.config.js');

const nextConfig = {
  output: 'standalone',
  assetPrefix: ''
};

export default withNextIntl(nextConfig);


