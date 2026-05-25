export interface UserType {
  role: string;
  [key: string]: unknown;
}
export interface SiteType {
  _id: string;

  siteName: string;

  deviceCount: number;
}

export interface DeviceType {
  _id: string;

  deviceName?: string;

  nodeUid?: string;
}

export interface PaginationType {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}
