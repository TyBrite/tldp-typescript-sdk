# @tybrite-labs/tldp-sdk

**TLDP — the Tybrite Logistics Developer Platform**

Official TypeScript SDK for the TLDP API. One integration replaces managing
relationships with many courier companies — quote rates, create
shipments, track deliveries in realtime, capture proof of delivery, handle
returns, and receive webhooks, all behind a single typed client.

## Features

- 📦 **One API, many couriers** — aggregate quotes and fulfilment across providers.
- ⚡ **Realtime tracking** — public tracking + live status events via webhooks.
- 🔁 **Reverse logistics** — first-class returns, exchanges, and refunds.
- 🛵 **On-demand delivery** — ride-hail-style dispatch for same-city parcels.
- 🔒 **Dual-key auth** — secret keys for your backend, publishable keys for read-only.
- 🧱 **Typed end to end** — every request and response is fully typed.
- 🔄 **Safe retries** — idempotency keys + automatic backoff built in.

## Installation

```bash
npm install @tybrite-labs/tldp-sdk
```

## Quick start

```typescript
import { TLDP } from '@tybrite-labs/tldp-sdk';

// Initialize the client with your secret key (server-side only).
const client = new TLDP({
  apiKey: 'tybrite_sk_test_YOUR_API_KEY',
});

// Quote a delivery across your enabled couriers.
const { quotes } = await client.rates.calculateRates({
  requestBody: {
    origin: { city: 'Nairobi' },
    destination: { city: 'Mombasa' },
    weight_kg: 2.5,
    service_level: 'standard',
  },
});

console.log(quotes); // each quote has quote_id, courier_name, total_price, …
```

## Authentication

The API uses **Bearer authentication**. Your API key encodes both your
environment (**test** vs **live**) and your permissions.

| Key type | Prefix | Access | Use from |
|----------|--------|--------|----------|
| **Secret** | `tybrite_sk_live_…` / `tybrite_sk_test_…` | Read / write | Your backend only — required for orders, shipments, returns. |
| **Publishable** | `tybrite_pk_live_…` / `tybrite_pk_test_…` | Read only | Client-side safe — rates, tracking, system. |

A `…_test_…` key operates entirely in **sandbox**: data is isolated, no money
moves, and webhook events are marked `livemode: false`. Switch to a `…_live_…`
key for production. Never ship a secret key to a browser or mobile app.

```typescript
const live = new TLDP({ apiKey: 'tybrite_sk_live_…' }); // production
const test = new TLDP({ apiKey: 'tybrite_sk_test_…' }); // sandbox
```

## Service reference

The SDK is organized into services that match the API resources. Access them on
the client instance (e.g. `client.orders`).

- **`orders`** — create, fetch, update, cancel, and fulfil customer orders (standard or on-demand), and get on-demand quotes.
- **`shipments`** — create, fetch, and cancel shipments directly.
- **`rates`** — calculate delivery rates across your enabled couriers and list serviceable zones.
- **`tracking`** — public tracking by number plus detailed shipment tracking events.
- **`proofOfDelivery`** — retrieve proof of delivery (photo / OTP / signature) for a delivered shipment.
- **`returns`** — request, approve, reject, receive, and resolve returns and exchanges.
- **`webhooks`** — manage webhook endpoints and send test events.
- **`system`** — API info and health checks.

## Usage examples

### Create and fulfil an order

```typescript
// Create an order (recipient + parcel). The response wraps the order object.
const { order } = await client.orders.createOrder({
  requestBody: {
    reference: 'ORDER-1042',
    delivery_method: 'last_mile',
    recipient: { name: 'Amina N.', phone: '+254700000000', city: 'Nairobi' },
    item: { description: 'Books', weight_kg: 1.2 },
  },
});

// Fulfil it with a chosen quote. Note: a quote's id is `quote_id` in the rates
// response, but fulfil takes it back as `rate_quote_id`.
const fulfilled = await client.orders.fulfilOrder({
  orderId: order.id,
  requestBody: {
    rate_quote_id: quotes[0].quote_id,
    delivery_method: 'last_mile',
  },
});

console.log(fulfilled.tracking_number);
```

### Track a shipment (public)

```typescript
const status = await client.tracking.trackShipment({
  trackingNumber: 'TLDP-20260608-0001',
});
console.log(status.status, status.estimated_delivery);
```

### On-demand (same-city) delivery

```typescript
// Quote every available tier (express / scheduled / on_the_way).
const quotes = await client.orders.onDemandQuote({
  orderId: order.id,
});

// Fulfil on-demand — dispatched to nearby independent riders.
const trip = await client.orders.fulfilOrderOnDemand({
  orderId: order.id,
  requestBody: { tier: 'scheduled' },
});
```

### Returns

```typescript
const ret = await client.returns.requestReturn({
  requestBody: { order_id: order.id, reason: 'damaged' },
});
await client.returns.approveReturn({ returnId: ret.id, requestBody: { resolution: 'refund' } });
```

## Idempotency (safe retries)

Pass an `idempotencyKey` on write operations so a retried request never
double-creates. The same key returns the original result.

```typescript
const order = await client.orders.createOrder({
  idempotencyKey: 'order-1042-2026-06-08',
  requestBody: { /* … */ },
});
```

The client also retries transient network/5xx failures automatically with
exponential backoff.

## Webhooks

Subscribe an endpoint to the events you care about, then verify each delivery's
`TLDP-Signature` header (HMAC-SHA256 over `timestamp.body` with your endpoint's
signing secret).

```typescript
const endpoint = await client.webhooks.createWebhook({
  requestBody: {
    url: 'https://yourapp.com/webhooks/tldp',
    events: ['shipment.delivered', 'order.fulfilled', 'return.refunded'],
  },
});
// endpoint.signing_secret is shown ONCE — store it securely.

// Send yourself a realistic test event:
await client.webhooks.testWebhook({ webhookId: endpoint.id });
```

Every event payload is `{ id, type, created, api_version, livemode, data: { object } }`.
Check `livemode` to distinguish sandbox (`false`) from production (`true`).

## Error handling

Failed requests throw an `ApiError` carrying the HTTP status and the API's error body.

```typescript
import { TLDP, ApiError } from '@tybrite-labs/tldp-sdk';

try {
  await client.orders.getOrder({ id: 'does-not-exist' });
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.status, err.body); // e.g. 404, { error: { code, message } }
  }
}
```

## Documentation

Full API reference and guides: **https://tldp.tybritelabs.com/docs**

## License

MIT © Tybrite Labs
