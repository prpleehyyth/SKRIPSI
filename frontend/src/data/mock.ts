import type { Device } from '../types';

export const MOCK: Device[] = [
    { device_id: 1, hostname: 'core-sw-01', sysName: 'CORE-SW-01', ip: '192.168.1.1', hardware: 'Cisco Catalyst 9300', os: 'IOS-XE', version: '17.9.3', status: 1 },
    { device_id: 2, hostname: 'dist-rt-01', sysName: 'DIST-RT-01', ip: '192.168.1.2', hardware: 'MikroTik CCR2004', os: 'RouterOS', version: '7.12.1', status: 1 },
    { device_id: 3, hostname: 'acc-sw-floor2', sysName: 'ACC-SW-F2', ip: '192.168.2.10', hardware: 'TP-Link TL-SG3428', os: 'TL-OS', version: '2.0.3', status: 0 },
    { device_id: 4, hostname: 'ap-lobby-01', sysName: 'AP-LOBBY-01', ip: '10.10.1.20', hardware: 'Ubiquiti U6-Pro', os: 'UniFi', version: '6.6.55', status: 1 },
    { device_id: 5, hostname: 'fw-main', sysName: 'FW-MAIN', ip: '192.168.0.1', hardware: 'Fortinet FG-100F', os: 'FortiOS', version: '7.4.2', status: 1 },
    { device_id: 6, hostname: 'nms-server', sysName: 'NMS-SERVER', ip: '10.0.0.5', hardware: 'Dell PowerEdge R440', os: 'Ubuntu', version: '22.04', status: 1 },
    { device_id: 7, hostname: 'acc-sw-floor3', sysName: 'ACC-SW-F3', ip: '192.168.3.10', hardware: 'TP-Link TL-SG3428', os: 'TL-OS', version: '2.0.1', status: 0 },
    { device_id: 8, hostname: 'ap-ruang-rapat', sysName: 'AP-RAPAT-01', ip: '10.10.1.21', hardware: 'Ubiquiti U6-Lite', os: 'UniFi', version: '6.5.28', status: 1 },
    { device_id: 9, hostname: 'dist-sw-02', sysName: 'DIST-SW-02', ip: '192.168.1.3', hardware: 'HP Aruba 2930F', os: 'ArubaOS', version: '16.11.0', status: 1 },
    { device_id: 10, hostname: 'ap-kantor-01', sysName: 'AP-KANTOR-01', ip: '10.10.1.22', hardware: 'Ubiquiti U6-Mesh', os: 'UniFi', version: '6.6.55', status: 0 },
];