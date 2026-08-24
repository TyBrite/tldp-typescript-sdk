/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecipientAddress = {
    name: string;
    phone: string;
    address: string;
    email?: string;
    /**
     * Defaults to the destination city of the quote.
     */
    city?: string;
    zone?: string;
    notes?: string;
};

