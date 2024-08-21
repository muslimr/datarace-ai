import withBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isAnalyze = process.env.ANALYZE === 'true';

const nextConfig = {
    // Add any other Next.js configuration here if needed
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

// Wrap your Next.js config with the bundle analyzer
export default withBundleAnalyzer({
    enabled: isAnalyze,
})(nextConfig);
