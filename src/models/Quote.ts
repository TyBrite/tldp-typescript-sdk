/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RateBreakdown } from './RateBreakdown';
import type { ServiceLevel } from './ServiceLevel';
export type Quote = {
    quote_id?: string;
    courier_id?: string;
    courier_name?: string;
    courier_tier?: Quote.courier_tier;
    service_level?: ServiceLevel;
    total_price?: number;
    currency?: string;
    estimated_delivery_hours?: number;
    estimated_delivery_date?: string;
    breakdown?: RateBreakdown;
    /**
     * Quote expires 2 minutes after creation.
     */
    valid_until?: string;
};
export namespace Quote {
    export enum courier_tier {
        BRONZE = 'bronze',
        SILVER = 'silver',
        GOLD = 'gold',
    }
}

