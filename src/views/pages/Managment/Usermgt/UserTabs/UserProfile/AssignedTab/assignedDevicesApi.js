import { GET, POST } from "../../../../../../../lib/request";
import { API } from "../../../../../../../lib/endpoint";

const normalizeDeviceList = (devices = []) => {
  const uniqueDevices = new Map();

  devices.forEach((device) => {
    const deviceKey = device?._id || device?.nodeUid;

    if (!deviceKey || uniqueDevices.has(deviceKey)) {
      return;
    }

    uniqueDevices.set(deviceKey, device);
  });

  return Array.from(uniqueDevices.values());
};

export const fetchSiteDevices = async ({ siteId }) => {
  const response = await GET(API.DEVICE.LIST_BY_SITEID(siteId));

  return normalizeDeviceList(response?.msg || []);
};

export const fetchUserAssignedDevices = async ({ siteId, userId }) => {
  const response = await POST(API.DEVICE.BY_SITE_AND_USER, {
    siteId,
    userId,
  });

  return normalizeDeviceList(response?.msg || []);
};
