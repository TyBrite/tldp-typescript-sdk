/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Subscribable webhook event. `order.*` = business/commitment state (one per transition);
 * `shipment.*` = physical-delivery telemetry (many); `return.*` = reverse logistics;
 * `payment.*` = settlement. See the API description → "Webhook events" for the layering.
 *
 */
export enum WebhookEvent {
    ORDER_CREATED = 'order.created',
    ORDER_FULFILLED = 'order.fulfilled',
    ORDER_CANCELLED = 'order.cancelled',
    RETURN_REQUESTED = 'return.requested',
    RETURN_APPROVED = 'return.approved',
    RETURN_REJECTED = 'return.rejected',
    RETURN_RECEIVED = 'return.received',
    RETURN_REFUNDED = 'return.refunded',
    RETURN_EXCHANGED = 'return.exchanged',
    SHIPMENT_CREATED = 'shipment.created',
    SHIPMENT_PAYMENT_CONFIRMED = 'shipment.payment_confirmed',
    SHIPMENT_ASSIGNED = 'shipment.assigned',
    SHIPMENT_PICKED_UP = 'shipment.picked_up',
    SHIPMENT_IN_TRANSIT = 'shipment.in_transit',
    SHIPMENT_OUT_FOR_DELIVERY = 'shipment.out_for_delivery',
    SHIPMENT_DELIVERED = 'shipment.delivered',
    SHIPMENT_FAILED = 'shipment.failed',
    SHIPMENT_CANCELLED = 'shipment.cancelled',
    PAYMENT_PENDING_SETTLEMENT = 'payment.pending_settlement',
    PAYMENT_SETTLED = 'payment.settled',
}
