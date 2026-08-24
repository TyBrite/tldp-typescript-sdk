/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Paging metadata for a list response.
 */
export type Pagination = {
    /**
     * The page size that was applied.
     */
    limit: number;
    /**
     * The offset that was applied.
     */
    offset: number;
    /**
     * Whether more items exist beyond this page.
     */
    has_more: boolean;
    /**
     * The offset to request for the next page, or null when there are no more items.
     */
    next_offset?: number | null;
};

