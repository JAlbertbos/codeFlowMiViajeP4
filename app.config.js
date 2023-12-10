export default {
  name: "codeflowmiviajep3",
  slug: "codeflowmiviajep3",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/foreground.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
};
