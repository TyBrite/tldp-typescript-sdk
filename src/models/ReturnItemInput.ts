/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReturnItemInput = {
    /**
     * The original order line item being returned.
     */
    order_item_id?: string;
    sku?: string;
    name: string;
    quantity?: number;
    unit_price?: number;
    /**
     * e.g. damaged, unused, opened
     */
    condition?: string;
};

