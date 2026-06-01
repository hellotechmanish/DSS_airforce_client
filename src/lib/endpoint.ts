export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOTPASSWORD: "/auth/forgot-password",
  },

  USERS: {
    LIST: "/users",
    CREATE: "/user/addUser",
    CREATE_SAFE: "/user/addUserSafe",
    EDIT: "/user/editUser",
    DELETE: "/user/deleteUser",
    UPDATE: (id: string) => `/users/${id}`,
    CHECK_UID: "/user/checkUserUid",
    RESET_PASSWORD: "/user/resetPassword",
    GET_ASSIGNED_SENSOR: "/user/getassignSensor",
    ASSIGN_DEVICE_SENSOR: "/user/assignDeviceSensor",
    ASSIGN_SITE: "/user/assignSite",
    LIST_BY_ROLE: (role: string) => `/user/userList/${role}`,
  },

  SITE: {
    COUNT: "/site/getnumberOfSite",
    CREATE: "/site/createSite",
    EDIT: "/site/editSite",
    DELETE: "/site/deleteSite",
    DELETE_FROM_USER: "/site/deleteSitefromuser",
    CHECK_UID: "/site/checkSiteUid",

    BY_USER: (userId: string) => `/site/getSiteByUserId/${userId}`,
    GET_ALL_SITE_GN: "/site/getAllSiteGn",
    GET_ALL_SITE_VMR: "/site/getAllSiteVmr",
    GET_ALL_SITE_SPD: "/site/getAllSiteSpd",
    GET_ALL_SITE_TEMP: "/site/getAllSiteTemp",
    ALL_RESISTANCE: "/site/getAllSiteResistance",
  },

  DEVICE: {
    CREATE: "/device/createDevice",
    EDIT: "/device/editDevice",
    DELETE: "/device/deleteDevice",
    CHECK_UID: "/device/checkDeviceUid",
    GET_BY_ID: (deviceId: string) => `/device/getDeviceById/${deviceId}`,
    LIST_BY_SITEID: (siteId: string) =>
      `/device/getdeviceListbysiteId/${siteId}`,
    LIST_BY_SITES: "/device/getdeviceListbysiteIds",
    GET_DATA_BY_ID: (deviceId: string) =>
      `/device/getDeviceDataById/${deviceId}`,
    BY_SITE_AND_USER: "/device/getdeviceListbysiteIdanduserId",
    LATEST_DATA: "/device/latestData",
    GET_SENSOR_DATA: (deviceId: string) => `/device/sensor-data/${deviceId}`,
    REBOOT: "/device/reboot",
    SHUTDOWN: "/device/shutdown",
    GENERATE_REPORT: "/device/generateReport",
    DOWNLOAD_CSV: "/device/downloadcsv",
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
    GET_NOTIFICATION_COUNT: "/alarm/getNotificationCount",
  },
};
