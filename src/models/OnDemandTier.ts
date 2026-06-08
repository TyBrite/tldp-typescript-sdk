/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * On-demand delivery speed. `express` = dedicate a trip now (same-city only, priciest);
 * `on_the_way` = a driver already heading there carries it (cheapest); `scheduled` =
 * flexible window (parcel rides along a trip); `driver_rate_card` = a driver's own price.
 * Pricing is flat per corridor, not per-km.
 *
 */
export enum OnDemandTier {
    EXPRESS = 'express',
    ON_THE_WAY = 'on_the_way',
    SCHEDULED = 'scheduled',
    DRIVER_RATE_CARD = 'driver_rate_card',
}
