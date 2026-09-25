import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl=createNextIntlPlugin('./src/i18n/request.ts');
const isPages=process.env.GITHUB_ACTIONS==='true';
const repo='/adawatak-financial';
const nextConfig:NextConfig={reactStrictMode:true,...(isPages?{output:'export',basePath:repo,assetPrefix:repo,trailingSlash:true,images:{unoptimized:true}}:{})};
export default withNextIntl(nextConfig);
