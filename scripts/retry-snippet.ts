/**
 * Automatic-retry snippet for the TLDP SDK.
 *
 * THIS FILE IS THE SOURCE OF TRUTH FOR RETRY BEHAVIOR. It is not compiled into the
 * SDK — `scripts/post-generate.js` splices the marked block below into the generated
 * `src/core/request.ts` after every codegen run. Do NOT hand-edit request.ts; edit
 * this file and re-run post-generate.
 *
 * Retries are a client concern, made SAFE by server-side idempotency:
 *   - GET/HEAD/OPTIONS/PUT/DELETE are idempotent -> always safe to retry.
 *   - POST/PATCH are retried on an HTTP status ONLY when an `Idempotency-Key` header
 *     is present (TLDP dedupes those server-side, e.g. POST /v1/shipments). A
 *     POST/PATCH without an idempotency key is retried only when fetch itself throws
 *     (network failure — nothing reached the server, no side effect possible).
 *   - Retryable statuses: 429, 500, 502, 503, 504. Backoff: exponential + jitter,
 *     honoring Retry-After. Disabled with OpenAPI.MAX_RETRIES = 0.
 */

// ===== TLDP-RETRY-BLOCK-START =====

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const IDEMPOTENT_METHODS = new Set(["GET", "HEAD", "OPTIONS", "PUT", "DELETE"]);

const retrySleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const parseRetryAfter = (response: Response): number | null => {
    const raw = response.headers.get("Retry-After");
    if (!raw) return null;
    const asInt = Number(raw);
    if (Number.isFinite(asInt)) return Math.max(0, asInt * 1000);
    const asDate = Date.parse(raw);
    if (!Number.isNaN(asDate)) return Math.max(0, asDate - Date.now());
    return null;
};

const isRetryableRequest = (options: ApiRequestOptions, headers: Headers): boolean => {
    const method = (options.method || "GET").toUpperCase();
    if (IDEMPOTENT_METHODS.has(method)) return true;
    return headers.has("Idempotency-Key");
};

export const sendRequestWithRetry = async (
    config: OpenAPIConfig,
    options: ApiRequestOptions,
    url: string,
    body: any,
    formData: FormData | undefined,
    headers: Headers,
    onCancel: OnCancel
): Promise<Response> => {
    const maxRetries = Math.max(0, config.MAX_RETRIES ?? 2);
    const baseDelay = Math.max(0, config.RETRY_DELAY_MS ?? 500);
    const httpRetryAllowed = maxRetries > 0 && isRetryableRequest(options, headers);

    let attempt = 0;
    while (true) {
        try {
            const response = await sendRequest(config, options, url, body, formData, headers, onCancel);
            if (!httpRetryAllowed || attempt >= maxRetries || !RETRYABLE_STATUS.has(response.status)) {
                return response;
            }
            const retryAfter = parseRetryAfter(response);
            const backoff = retryAfter ?? baseDelay * 2 ** attempt + Math.floor(Math.random() * baseDelay);
            attempt += 1;
            if (onCancel.isCancelled) return response;
            await retrySleep(backoff);
        } catch (error) {
            if (maxRetries <= 0 || attempt >= maxRetries || onCancel.isCancelled) throw error;
            const backoff = baseDelay * 2 ** attempt + Math.floor(Math.random() * baseDelay);
            attempt += 1;
            await retrySleep(backoff);
        }
    }
};

// ===== TLDP-RETRY-BLOCK-END =====
