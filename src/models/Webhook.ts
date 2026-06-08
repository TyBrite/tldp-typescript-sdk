/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Webhook = {
    id?: string;
    url?: string;
    events?: Array<string>;
    status?: Webhook.status;
    created_at?: string;
    /**
     * Returned ONLY at creation. Store it securely.
     */
    signing_secret?: string;
};
export namespace Webhook {
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
    }
}

