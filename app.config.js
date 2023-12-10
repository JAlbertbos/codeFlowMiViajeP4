export default {
    name: "codeflowmiviajep3",
    slug: "codeflowmiviajep3",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./path/to/your/icon.png",
    splash: {
      image: "./path/to/your/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./path/to/your/foreground.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./path/to/your/favicon.png"
    }
  };