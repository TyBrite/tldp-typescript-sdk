/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Webhook } from '../models/Webhook';
import type { WebhookEvent } from '../models/WebhookEvent';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class WebhooksService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a webhook endpoint
     * Registers a webhook URL. The `signing_secret` is returned ONCE — store it.
     * @returns any Webhook created (includes signing_secret).
     * @throws ApiError
     */
    public createWebhook({
        requestBody,
    }: {
        requestBody: {
            url: string;
            /**
             * The events to subscribe to (order.* / shipment.* / return.* / payment.*).
             */
            events: Array<WebhookEvent>;
            description?: string;
        },
    }): CancelablePromise<{
        webhook?: Webhook;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/webhooks',
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
     * List webhook endpoints
     * @returns any Configured webhooks.
     * @throws ApiError
     */
    public listWebhooks(): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/webhooks',
            errors: {
                401: `Missing or invalid API key.`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Delete a webhook endpoint
     * @returns any Deleted.
     * @throws ApiError
     */
    public deleteWebhook({
        webhookId,
    }: {
        /**
         * The webhook endpoint id.
         */
        webhookId: string,
    }): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/v1/webhooks/{webhookId}',
            path: {
                'webhookId': webhookId,
            },
            errors: {
                401: `Missing or invalid API key.`,
                403: `The key lacks the required scope, or the account is inactive.`,
                404: `The requested resource does not exist (or isn't yours).`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Send a test event
     * @returns any Test event queued for delivery.
     * @throws ApiError
     */
    public testWebhook({
        webhookId,
    }: {
        /**
         * The webhook endpoint id.
         */
        webhookId: string,
    }): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/webhooks/{webhookId}/test',
            path: {
                'webhookId': webhookId,
            },
            errors: {
                401: `Missing or invalid API key.`,
                403: `The key lacks the required scope, or the account is inactive.`,
                404: `The requested resource does not exist (or isn't yours).`,
                429: `Rate limit exceeded for the current window.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
