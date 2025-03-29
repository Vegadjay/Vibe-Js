import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Audio file handling
    config.module.rules.push({
      test: /\.(wav|mp3|ogg|mpe?g)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            publicPath: '/_next/static/',
            outputPath: 'static/',
          },
        },
      ],
    });

    // Font file handling
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            publicPath: '/_next/static/',
            outputPath: 'static/',
          },
        },
      ],
    });

    return config;
  },
  // Add static directory to the asset pipeline
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')],
  },
  // Ensure images are handled properly
  images: {
    disableStaticImages: false,
  },
};

export default nextConfig;