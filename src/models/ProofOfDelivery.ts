/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProofOfDelivery = {
    shipment_id?: string;
    tracking_number?: string;
    delivered_at?: string | null;
    pod?: {
        type?: ProofOfDelivery.type;
        verified_at?: string | null;
        data?: Record<string, any>;
    };
};
export namespace ProofOfDelivery {
    export enum type {
        PHOTO = 'photo',
        OTP = 'otp',
        SIGNATURE = 'signature',
    }
}

