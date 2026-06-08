/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RateBreakdown = {
    base_rate?: number;
    weight_surcharge?: number;
    zone_addon?: number;
    service_multiplier?: number;
    special_surcharges?: Array<{
        type?: string;
        amount?: number;
    }>;
    courier_subtotal?: number;
    platform_fee?: number;
};

