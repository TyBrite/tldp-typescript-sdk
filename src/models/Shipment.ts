/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ServiceLevel } from './ServiceLevel';
import type { ShipmentStatus } from './ShipmentStatus';
export type Shipment = {
    id?: string;
    tracking_number?: string;
    status?: ShipmentStatus;
    created_at?: string;
    updated_at?: string;
    service_level?: ServiceLevel;
    recipient?: Address;
    pricing?: {
        total?: number;
        currency?: string;
    };
    timeline?: {
        created_at?: string;
        picked_up_at?: string | null;
        delivered_at?: string | null;
        estimated_delivery?: string;
    };
    tracking_url?: string;
};

