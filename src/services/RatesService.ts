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
     * @returns any Available quotes.
     * @throws ApiError
     */
    public calculateRates({
        requestBody,
    }: {
        requestBody: {
            origin: {
                city: string;
                zone?: string;
            };
            destination: {
                city: string;
                zone?: string;
            };
            weight_kg: number;
            declared_value?: number;
            service_level?: ServiceLevel;
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
