/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShipmentStatus } from './ShipmentStatus';
import type { TrackingEvent } from './TrackingEvent';
export type PublicTracking = {
    tracking_number?: string;
    status?: ShipmentStatus;
    estimated_delivery?: string;
    recipient?: {
        name?: string;
        city?: string;
    };
    courier?: any | null;
    events?: Array<TrackingEvent>;
};

