// src/lib/endpoints.js
export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOTPASSWORD: "/auth/forgot-password",
  },

  USERS: {
    LIST: "/users",
    CREATE: "/user/addUser",
    UPDATE: (id) => `/users/${id}`,
    GET_ASSIGNED_SENSOR: "/user/getassignSensor",
    ASSIGN_DEVICE_SENSOR: "/user/assignDeviceSensor",
    LIST_BY_ROLE: (role) => `/user/userList/${role}`,
    CHECK_UID: "/user/checkUserUid",
  },

  SITE: {
    COUNT: "/site/getnumberOfSite",
    BY_USER: (userId) => `/site/getSiteByUserId/${userId}`,
    ALL_RESISTANCE: "/site/getAllSiteResistance",
    CREATE: "/site/createSite",
    DELETE_FROM_USER: "/site/deleteSitefromuser",
  },

  DEVICE: {
    CREATE: "/device/createDevice",
    CHECK_UID: "/device/checkDeviceUid",
    GET_BY_ID: (deviceId) => `/device/getDeviceById/${deviceId}`,
    LIST_BY_SITE: (siteId) => `/device/getdeviceListbysiteId/${siteId}`,
    LATEST_DATA: "/device/latestData",
    REBOOT: "/device/reboot",
    SHUTDOWN: "/device/shutdown",
    BY_SITE_AND_USER: "/device/getdeviceListbysiteIdanduserId",
  },

  ALARM: {
    LIST: "/alarm/getAllAlarm",
    DATA: "/alarm/getAlarmData",
    GRAPH: "/alarm/getAlarmGraphValue",
    DOWNLOAD: "/alarm/getAllAlarmDataForDownload",
    DELETE: "/alarm/deleteAlarm",
    FILTER: "/alarm/filteredAlarm",
    UPDATE_STATUS: "/alarm/updateStatus",
    STATUS: "/alarm/getAlarmStatus",
    NOTIFICATION_COUNT: "/alarm/getNotificationCount",
  },
};
