/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReturnItemInput } from '../models/ReturnItemInput';
import type { ReturnReason } from '../models/ReturnReason';
import type { ReturnResolution } from '../models/ReturnResolution';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ReturnsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Request a return or exchange
     * Open a return against a **delivered** order. Validated against the merchant's returns
     * policy (accepts-returns, accepted reasons, window). Pass `items[]` for a partial return.
     * Liability for the reverse-leg/refund is resolved from the merchant's reason→party policy.
     * Requires a secret (sk_) key. Emits `return.requested`.
     *
     * @returns any Return created.
     * @throws ApiError
     */
    public requestReturn({
        requestBody,
    }: {
        requestBody: {
            order_id: string;
            reason: ReturnReason;
            customer_note?: string;
            /**
             * The line items being returned (partial returns supported).
             */
            items?: Array<ReturnItemInput>;
        },
    }): CancelablePromise<{
        return?: Record<string, any>;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/returns',
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
    /**
     * List your returns
     * @returns any Returns.
     * @throws ApiError
     */
    public listReturns(): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/returns',
            errors: {
                401: `Missing or invalid API key.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Retrieve a return
     * @returns any The return (with `items[]`).
     * @throws ApiError
     */
    public getReturn({
        returnId,
    }: {
        returnId: string,
    }): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/returns/{returnId}',
            path: {
                'returnId': returnId,
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
     * Approve a return + choose resolution
     * Approve the return and pick the resolution (must be allowed by policy). Creates the
     * **reverse pickup shipment** (customer → merchant). For an `exchange`, the replacement is
     * shipped at resolve time. Requires a secret key. Emits `return.approved`.
     *
     * @returns any Approved — reverse shipment created.
     * @throws ApiError
     */
    public approveReturn({
        returnId,
        requestBody,
    }: {
        returnId: string,
        requestBody: {
            resolution: ReturnResolution;
            merchant_note?: string;
        },
    }): CancelablePromise<{
        return_id?: string;
        status?: string;
        reverse_shipment_id?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/returns/{returnId}/approve',
            path: {
                'returnId': returnId,
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
    /**
     * Reject a return
     * @returns any Rejected.
     * @throws ApiError
     */
    public rejectReturn({
        returnId,
        requestBody,
    }: {
        returnId: string,
        requestBody?: {
            merchant_note?: string;
        },
    }): CancelablePromise<{
        return_id?: string;
        status?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/returns/{returnId}/reject',
            path: {
                'returnId': returnId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Missing or invalid API key.`,
                403: `The key lacks the required scope, or the account is inactive.`,
                404: `The requested resource does not exist (or isn't yours).`,
                409: `The resource is in a state that doesn't allow this operation.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Mark the returned goods received
     * Call after the reverse shipment is delivered back to you. Requires a secret key. Emits `return.received`.
     * @returns any Received.
     * @throws ApiError
     */
    public receiveReturn({
        returnId,
    }: {
        returnId: string,
    }): CancelablePromise<{
        return_id?: string;
        status?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/returns/{returnId}/receive',
            path: {
                'returnId': returnId,
            },
            errors: {
                401: `Missing or invalid API key.`,
                403: `The key lacks the required scope, or the account is inactive.`,
                404: `The requested resource does not exist (or isn't yours).`,
                409: `The resource is in a state that doesn't allow this operation.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Resolve a received return
     * Settle a received return per its resolution: `refund` (refunds the customer and claws back
     * the liable party's settled cut via the payout ledger), `exchange` (ships a replacement to
     * the customer — no refund), or `repair`/`store_credit`. Requires a secret key. Emits
     * `return.refunded` or `return.exchanged`.
     *
     * @returns any Resolved.
     * @throws ApiError
     */
    public resolveReturn({
        returnId,
        requestBody,
    }: {
        returnId: string,
        requestBody?: {
            /**
             * Flag the returned items to be restocked.
             */
            restock?: boolean;
        },
    }): CancelablePromise<{
        return_id?: string;
        status?: string;
        resolution?: ReturnResolution;
        refund_amount?: number | null;
        replacement_shipment_id?: string | null;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/returns/{returnId}/resolve',
            path: {
                'returnId': returnId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
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
