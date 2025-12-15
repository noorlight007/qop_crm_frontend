import { UAParser } from "ua-parser-js";

export const getDeviceInfo = () => {
  try {
    console.log("Getting device info...");
    const parser = new UAParser();
    const result = parser.getResult();
    console.log("UAParser result:", result);

    const deviceId =
      localStorage.getItem("device_id") ??
      (() => {
        const id = crypto.randomUUID();
        localStorage.setItem("device_id", id);
        return id;
      })();

    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio,
      },

      os: `${result.os.name ?? "Unknown"} ${result.os.version ?? ""}`,
      browser: `${result.browser.name ?? "Unknown"} ${
        result.browser.version ?? ""
      }`,
      isMobile: result.device.type === "mobile",
      deviceId,
    };

    console.log("Final device info:", deviceInfo);
    return deviceInfo;
  } catch (error) {
    console.error("Error getting device info:", error);
    return {};
  }
};
