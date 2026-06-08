/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * How the customer receives the parcel. `station_pickup` = collect at a delivery
 * station (base fee only). `last_mile` = rider delivers from the station to the
 * door (base + station last-mile fee).
 *
 */
export enum DeliveryMethod {
    STATION_PICKUP = 'station_pickup',
    LAST_MILE = 'last_mile',
}
