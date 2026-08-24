/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeliveryMethod } from '../models/DeliveryMethod';
import type { OnDemandTier } from '../models/OnDemandTier';
import type { OrderItemInput } from '../models/OrderItemInput';
import type { Pagination } from '../models/Pagination';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OrdersService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a customer order
     * Push a customer order captured on your own online channel (e.g. a Shopify /
     * WooCommerce store) into TLDP. The order starts as `pending_fulfilment`; fulfil
     * it later with a shipment. Pass `items[]` to record the cart line items (TLDP is a
     * standalone order store — items are auditable and visible across the platform).
     * Requires a secret (sk_) key. Emits an `order.created` webhook.
     *
     * Pass an `Idempotency-Key` header to make retries safe: repeating the same key
     * returns the original order instead of creating a duplicate.
     *
     * @returns any Order created.
     * @throws ApiError
     */
    public createOrder({
        requestBody,
        idempotencyKey,
    }: {
        requestBody: {
            /**
             * Your own order reference
             */
            reference?: string;
            delivery_method?: DeliveryMethod;
            recipient: {
                name: string;
                phone: string;
                email?: string;
                address: string;
                city: string;
                lat?: number;
                lng?: number;
            };
            /**
             * Parcel summary used for the shipment.
             */
            item?: {
                description?: string;
                weight_kg?: number;
                declared_value?: number;
            };
            /**
             * Cart line items. Each item's total_price is computed (quantity × unit_price).
             */
            items?: Array<OrderItemInput>;
            origin?: {
                city?: string;
                lat?: number;
                lng?: number;
            };
        },
        /**
         * A unique key (UUID) that makes a write request safely retryable.
         */
        idempotencyKey?: string,
    }): CancelablePromise<{
        order?: Record<string, any>;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/orders',
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request — missing or malformed parameters.`,
                401: `Missing or invalid API key.`,
                403: `The key lacks the required scope, or the account is inactive.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * List your orders
     * List your orders, newest first. Page with `limit` (default 50, max 100) and `offset`;
     * the response's `pagination` block tells you whether more pages exist and the
     * `next_offset` to request.
     *
     * @returns any A page of orders.
     * @throws ApiError
     */
    public listOrders({
        limit = 50,
        offset,
    }: {
        /**
         * Maximum number of items to return (1–100). Defaults to 50.
         */
        limit?: number,
        /**
         * Number of items to skip, for paging. Defaults to 0. Use the response's `pagination.next_offset` to fetch the next page.
         */
        offset?: number,
    }): CancelablePromise<{
        orders?: Array<Record<string, any>>;
        pagination?: Pagination;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/orders',
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                400: `Invalid request — missing or malformed parameters.`,
                401: `Missing or invalid API key.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Retrieve an order
     * Full order detail including line items — TLDP can be used as a standalone order store, not just tracking.
     * @returns any The order (with `items[]`).
     * @throws ApiError
     */
    public getOrder({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/orders/{orderId}',
            path: {
                'orderId': orderId,
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
     * Edit an order
     * Edit an order while it is still `pending_fulfilment` (recipient, parcel,
     * delivery method, reference, and/or line items). Passing `items[]` REPLACES the
     * existing line items. Once fulfilled the shipment is the source of truth and edits
     * are rejected (409). Requires a secret (sk_) key.
     *
     * @returns any Updated order (with `items[]`).
     * @throws ApiError
     */
    public updateOrder({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: {
            reference?: string;
            delivery_method?: DeliveryMethod;
            recipient?: {
                name?: string;
                phone?: string;
                email?: string;
                address?: string;
                city?: string;
                lat?: number;
                lng?: number;
            };
            item?: {
                description?: string;
                weight_kg?: number;
                declared_value?: number;
            };
            /**
             * Replaces all existing line items when provided.
             */
            items?: Array<OrderItemInput>;
        },
    }): CancelablePromise<{
        order?: Record<string, any>;
    }> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/v1/orders/{orderId}',
            path: {
                'orderId': orderId,
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
     * Cancel an order
     * Cancel an order. If a shipment exists but has not yet been picked up it is
     * cancelled too; if it is already in transit the request is rejected (409).
     * Requires a secret (sk_) key. Emits an `order.cancelled` webhook.
     *
     * @returns any Cancelled.
     * @throws ApiError
     */
    public cancelOrder({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody?: {
            reason?: string;
        },
    }): CancelablePromise<{
        order_id?: string;
        status?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/orders/{orderId}/cancel',
            path: {
                'orderId': orderId,
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
     * Fulfil an order with a shipment
     * Create a shipment for a pending order from a rate quote. Choose the delivery
     * method: `station_pickup` (customer collects at a delivery station) or `last_mile`
     * (a rider delivers from the station; the station's last-mile fee is applied).
     * Requires a secret key. Emits an `order.fulfilled` webhook.
     *
     * @returns any Fulfilled — shipment created.
     * @throws ApiError
     */
    public fulfilOrder({
        orderId,
        requestBody,
        idempotencyKey,
    }: {
        orderId: string,
        requestBody: {
            rate_quote_id: string;
            /**
             * First-mile pickup point (merchant→courier).
             */
            pickup_point_id?: string;
            delivery_method?: DeliveryMethod;
            /**
             * Last-mile / pickup station (courier→customer). Drives the last-mile fee.
             */
            delivery_station_id?: string;
        },
        /**
         * A unique key (UUID) that makes a write request safely retryable.
         */
        idempotencyKey?: string,
    }): CancelablePromise<{
        order_id?: string;
        shipment_id?: string;
        tracking_number?: string;
        tracking_url?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/orders/{orderId}/fulfil',
            path: {
                'orderId': orderId,
            },
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
                409: `The resource is in a state that doesn't allow this operation.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Quote on-demand delivery tiers
     * Return on-demand (ride-hail / independent-driver) fare quotes for the order's
     * corridor across the available tiers — `express` (dedicate a trip now, same-city
     * only), `on_the_way` (a driver already heading there carries it; cheapest), and
     * `scheduled` (flexible window). Tiers are eligible only when the merchant has enabled
     * on-demand and the corridor allows it. Pricing is flat per corridor, not per-km.
     *
     * @returns any Tier quotes.
     * @throws ApiError
     */
    public onDemandQuote({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<{
        tiers?: Array<{
            tier?: OnDemandTier;
            eligible?: boolean;
            reason?: string | null;
            fare?: number | null;
            eta_min?: number | null;
        }>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/orders/{orderId}/on-demand-quote',
            path: {
                'orderId': orderId,
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
     * Fulfil an order via the on-demand driver pool
     * Dispatch the order to nearby on-demand drivers at the chosen tier (`express` /
     * `on_the_way` / `scheduled`). Creates the shipment at the tier fare and broadcasts an
     * offer to matching online drivers — first to accept picks it up. Requires a secret key.
     * Emits an `order.fulfilled` webhook.
     *
     * @returns any Dispatched — shipment created and offered to drivers.
     * @throws ApiError
     */
    public fulfilOrderOnDemand({
        orderId,
        idempotencyKey,
        requestBody,
    }: {
        orderId: string,
        /**
         * A unique key (UUID) that makes a write request safely retryable.
         */
        idempotencyKey?: string,
        requestBody?: {
            tier?: OnDemandTier;
        },
    }): CancelablePromise<{
        order_id?: string;
        shipment_id?: string;
        tracking_number?: string;
        tracking_url?: string;
        fulfilment?: string;
        tier?: OnDemandTier;
        fare?: number;
        /**
         * How many drivers were offered the delivery.
         */
        offers?: number;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/orders/{orderId}/fulfil-on-demand',
            path: {
                'orderId': orderId,
            },
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
                409: `The resource is in a state that doesn't allow this operation.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
