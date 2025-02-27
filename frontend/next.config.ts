import { merge, cloneDeep } from "lodash";
import type { NextConfig } from "next";
import path from "path";
// @ts-ignore
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import type { NetworkName } from "@explorer/common/types/common";
import { getOverrides } from "@explorer/common/utils/environment";
import type {
  BackendConfig,
  ExplorerConfig,
  NearNetwork,
} from "@explorer/frontend/libraries/config";

const statsOptions = {
  baseDir: "stats",
  enabled: Boolean(process.env.STATS),
  openAnalyzer: Boolean(process.env.OPEN_ANALYZER),
};

const defaultBackendConfig: BackendConfig = {
  hosts: {
    mainnet: "localhost",
    testnet: "localhost",
    shardnet: "localhost",
    guildnet: "localhost",
    localnet: "localhost",
  },
  port: 10000,
  secure: false,
};

const config = merge(
  {
    backend: cloneDeep(defaultBackendConfig),
    backendSsr: cloneDeep(defaultBackendConfig),
    networks: {} as Partial<Record<NetworkName, NearNetwork>>,
    googleAnalytics: undefined,
    segmentWriteKey: "",
    gleapKey: undefined,
  },
  getOverrides("NEAR_EXPLORER_CONFIG")
);

const nextConfig: ExplorerConfig & NextConfig = {
  serverRuntimeConfig: {
    backendConfig: config.backendSsr,
  },
  publicRuntimeConfig: {
    nearNetworks: config.networks,
    backendConfig: config.backend,
    googleAnalytics: config.googleAnalytics,
    segmentWriteKey: config.segmentWriteKey,
    gleapKey: config.gleapKey,
  },
  webpack: (webpackConfig, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        child_process: false,
      };
    }
    webpackConfig.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    if (statsOptions.enabled) {
      webpackConfig.plugins.push(
        // Analyzer with foam plot
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: statsOptions.openAnalyzer,
          reportFilename: isServer
            ? path.join(statsOptions.baseDir, "./server.html")
            : path.join(statsOptions.baseDir, "./client.html"),
          generateStatsFile: true,
        })
      );
    }

    return webpackConfig;
  },
  experimental: {
    externalDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
