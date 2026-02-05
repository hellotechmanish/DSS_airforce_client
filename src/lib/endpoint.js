// src/lib/endpoints.js
export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOTPASSWORD: "/auth/forgot-password",
  },

  USERS: {
    LIST: "/users",
    UPDATE: (id) => `/users/${id}`,
  },

  SITE: {
    COUNT: "/site/getnumberOfSite",
    ALL_RESISTANCE: "/site/getAllSiteResistance",
    CREATE: "/site/createSite",
  },
  DEVICE: {
    CREATE: "/device/createDevice",
    CHECK_UID: "/device/checkDeviceUid",
    LIST_BY_SITE: (siteId) => `/device/getdeviceListbysiteId/${siteId}`,
    LATEST_DATA: "/device/latestData", // ✅ ADD THIS
  },
  ALARM: {
    CREATE: "/device/createDevice",
    CHECK_UID: "/device/checkDeviceUid",
    LIST_BY_SITE: (siteId) => `/device/getdeviceListbysiteId/${siteId}`,
    LATEST_DATA: "/device/latestData",
    REBOOT_STATUS: "/device/reboot",
    NOTIFICATION_COUNT: "/alarm/getNotificationCount",
  },
};
