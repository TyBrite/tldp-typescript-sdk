/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SystemService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * API info
     * @returns any Service metadata and available endpoints.
     * @throws ApiError
     */
    public getApiInfo(): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
            errors: {
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Health check
     * @returns any Service is healthy.
     * @throws ApiError
     */
    public getHealth(): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/health',
            errors: {
                429: `Rate limit exceeded for the current window.`,
                503: `Service is unavailable.`,
            },
        });
    }
}
