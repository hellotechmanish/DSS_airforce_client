export interface UserType {
  role: string;
  [key: string]: unknown;
}
export interface SiteType {
  _id: string;
  siteUid: string;

  siteName: string;

  deviceCount: number;
}

// export interface DeviceType {
//   _id: string;
//   deviceName?: string;
//   nodeUid?: string;
//   temperatureSensors: string;
//   humiditySensors: string;
//   resSensors?: string;
//   vmrSensors?: string;
//   spdSensors?: string;
//   nerSensors?: string;
//   siteId?: {
//     _id: string;
//     siteName: string;
//   };
// }

export interface DeviceType {
  _id: string;

  deviceName: string;

  nodeUid: string;

  sensorCounts: {
    temperature: number;
    humidity: number;
    vmr: number;
    res: number;
    spd: number;
    ner: number;
  };

  thresholds?: {
    vmr?: {
      r?: number;
      y?: number;
      b?: number;
      ry?: number;
      yb?: number;
      rb?: number;
    };

    res?: number;

    spd?: number;

    ner?: number;
  };

  isActive?: boolean;

  siteId?: {
    _id: string;
    siteName: string;
  };

  createdAt?: string;

  updatedAt?: string;
}

export interface PaginationType {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}
