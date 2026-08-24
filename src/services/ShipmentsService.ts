/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from '../models/Address';
import type { Parcel } from '../models/Parcel';
import type { RecipientAddress } from '../models/RecipientAddress';
import type { Shipment } from '../models/Shipment';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ShipmentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a shipment
     * Locks a rate quote and creates a shipment. Requires a secret (sk_) key.
     * Send an `Idempotency-Key` header to make retries safe — a repeated key
     * returns the original shipment instead of creating a duplicate.
     *
     * @returns any Idempotent replay — existing shipment returned.
     * @throws ApiError
     */
    public createShipment({
        requestBody,
        idempotencyKey,
    }: {
        requestBody: {
            rate_quote_id: string;
            recipient: RecipientAddress;
            sender?: Address;
            parcel?: Parcel;
            payment?: {
                method?: string;
                reference?: string;
            };
            options?: {
                pod_type?: 'photo' | 'otp' | 'signature';
                signature_required?: boolean;
                insurance?: boolean;
            };
            metadata?: Record<string, any>;
        },
        /**
         * A unique key (UUID) that makes a write request safely retryable.
         */
        idempotencyKey?: string,
    }): CancelablePromise<{
        shipment?: Shipment;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/shipments',
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
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
     * Retrieve a shipment
     * @returns any The shipment.
     * @throws ApiError
     */
    public getShipment({
        shipmentId,
    }: {
        /**
         * The shipment's unique id.
         */
        shipmentId: string,
    }): CancelablePromise<{
        shipment?: Shipment;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/shipments/{shipmentId}',
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
    /**
     * Cancel a shipment
     * Cancels a shipment before pickup. Requires a secret key.
     * @returns any Cancelled, with refund status.
     * @throws ApiError
     */
    public cancelShipment({
        shipmentId,
        requestBody,
    }: {
        /**
         * The shipment's unique id.
         */
        shipmentId: string,
        requestBody?: {
            reason?: string;
        },
    }): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/shipments/{shipmentId}/cancel',
            path: {
                'shipmentId': shipmentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request — missing or malformed parameters.`,
                401: `Missing or invalid API key.`,
                403: `The key lacks the required scope, or the account is inactive.`,
                404: `The requested resource does not exist (or isn't yours).`,
                409: `The resource is in a state that doesn't allow this operation.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
