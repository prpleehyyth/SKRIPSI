export interface Device {
    device_id: number;
    hostname: string;
    sysName: string;
    ip: string;
    hardware: string;
    os: string;
    version: string;
    status: number;
}

export type Page = 'dashboard' | 'inventory' | 'gis';
export type FilterStatus = 'all' | 'online' | 'offline';