/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProofOfDelivery } from '../models/ProofOfDelivery';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProofOfDeliveryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get proof of delivery
     * Returns proof of delivery for a delivered shipment. OTP codes are never returned.
     * @returns ProofOfDelivery Proof of delivery.
     * @throws ApiError
     */
    public getProofOfDelivery({
        shipmentId,
    }: {
        /**
         * The shipment's unique id.
         */
        shipmentId: string,
    }): CancelablePromise<ProofOfDelivery> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/pod/{shipmentId}',
            path: {
                'shipmentId': shipmentId,
            },
            errors: {
                401: `Missing or invalid API key.`,
                404: `The requested resource does not exist (or isn't yours).`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
