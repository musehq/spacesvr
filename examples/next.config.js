// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias["spacesvr"] = path.resolve(__dirname, "../src");
    config.resolve.alias["react"] = path.resolve(
      __dirname,
      "../node_modules/react"
    );
    config.resolve.alias["react-dom"] = path.resolve(
      __dirname,
      "../node_modules/react-dom"
    );
    config.resolve.extensions = ["", ".js", ".jsx", ".ts", ".tsx"];
    config.experiments = { topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
