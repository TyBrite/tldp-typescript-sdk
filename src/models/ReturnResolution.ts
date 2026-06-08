/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * How a return is settled. `exchange` ships a replacement (no refund); `refund` refunds the customer and claws back the liable party's settled cut; `repair`/`store_credit` move no courier money; `reject` declines it.
 */
export enum ReturnResolution {
    REFUND = 'refund',
    EXCHANGE = 'exchange',
    REPAIR = 'repair',
    STORE_CREDIT = 'store_credit',
    REJECT = 'reject',
}
