/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Quote } from '../models/Quote';
import type { ServiceLevel } from '../models/ServiceLevel';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RatesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Calculate shipping rates
     * Returns quotes from every courier serving the route, sorted by price then
     * courier tier. The 10% platform commission is already included in
     * `total_price`. Each `quote_id` is valid for 2 minutes and is required to
     * create a shipment.
     *
     * **Precise pricing by location.** For each endpoint you may pass `zone` (a named
     * pricing area), exact `lat`/`lng` coordinates, or a free-form `place` string —
     * coordinates take precedence, then a place name is resolved to coordinates
     * automatically. When coordinates are supplied, each courier's price is matched to
     * the bounded service area the point falls in (more accurate than a city name alone).
     * `city` is always required as the coarse filter.
     *
     * **Door-delivery distance charge.** When `delivery_method` is `last_mile` (door
     * delivery) and the destination lies beyond a courier's service area, the quote may
     * include a `distance_overage` — a courier-set surcharge for distance past the area,
     * shown in `breakdown.distance_overage`. Pickup-station deliveries are never charged
     * this surcharge.
     *
     * @returns any Available quotes.
     * @throws ApiError
     */
    public calculateRates({
        requestBody,
    }: {
        requestBody: {
            origin: {
                city: string;
                /**
                 * Named pricing area within the city.
                 */
                zone?: string;
                /**
                 * Free-form place/area, resolved to coordinates.
                 */
                place?: string;
                /**
                 * Latitude; takes precedence over place/zone for area matching.
                 */
                lat?: number;
                /**
                 * Longitude; takes precedence over place/zone for area matching.
                 */
                lng?: number;
            };
            destination: {
                city: string;
                /**
                 * Named pricing area within the city.
                 */
                zone?: string;
                /**
                 * Free-form place/area, resolved to coordinates.
                 */
                place?: string;
                /**
                 * Latitude; takes precedence over place/zone for area matching.
                 */
                lat?: number;
                /**
                 * Longitude; takes precedence over place/zone for area matching.
                 */
                lng?: number;
            };
            weight_kg: number;
            declared_value?: number;
            service_level?: ServiceLevel;
            /**
             * `last_mile` = delivered to the recipient's door (may incur a distance charge); `pickup` = collected at a pickup station (no distance charge).
             */
            delivery_method?: 'last_mile' | 'pickup';
            special_flags?: Array<string>;
        },
    }): CancelablePromise<{
        quotes?: Array<Quote>;
        meta?: {
            request_id?: string;
            count?: number;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/rates/calculate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request — missing or malformed parameters.`,
                401: `Missing or invalid API key.`,
                403: `The key lacks the required scope, or the account is inactive.`,
                404: `The requested resource does not exist (or isn't yours).`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * List coverage zones
     * Coverage cities/zones (global — same for everyone). **Edge-cached** (~5 min) and ETag-validated.
     * @returns any Cities/zones with coverage.
     * @throws ApiError
     */
    public listZones(): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/rates/zones',
            errors: {
                304: `The resource is unchanged since your \`If-None-Match\` ETag — body omitted.`,
                401: `Missing or invalid API key.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
