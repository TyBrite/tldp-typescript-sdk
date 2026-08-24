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

// Rates are read-only — a publishable key is enough (safe client-side).
const client = new TLDP({
  apiKey: 'tybrite_pk_test_YOUR_API_KEY',
});

// Quote a delivery across your enabled couriers.
const { quotes } = await client.rates.calculateRates({
  requestBody: {
    origin: { city: 'Nairobi' },
    destination: { city: 'Mombasa' },
    weight_kg: 2.5,
    service_level: 'standard',
    delivery_method: 'last_mile',
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
the client instance (e.g. `client.orders`). Every method is listed here.

- **`orders`** — the commercial record of what a customer bought, kept separate from the physical
  delivery so an order can exist before a courier is chosen. `createOrder` records it;
  `listOrders` pages through them (`limit`/`offset`, newest first) and `getOrder` fetches one with
  its line items. `updateOrder` edits an order **only while it is `pending_fulfilment`** — once
  fulfilled the shipment is booked and a courier holds it, so an edit is rejected with a `409`
  rather than silently diverging from the label. `cancelOrder` cancels before fulfilment.
  `fulfilOrder` turns an order into a shipment using a `rate_quote_id` from `rates.calculateRates`,
  which is the point a courier is committed. For same-city work, `onDemandQuote` prices an
  independent-driver delivery by tier (`express`, `on_the_way`, `scheduled`) and
  `fulfilOrderOnDemand` dispatches it, returning the number of drivers offered the job. An order's
  status follows its shipment, so it becomes `in_delivery` and then `delivered` on its own.
- **`shipments`** — the physical movement. Use these when you do not need an order record and the
  shipment *is* the unit of work — a B2B, bulk, or headless flow. `createShipment` books one from
  a quote in a single call; `recipient.name`, `recipient.phone` and `recipient.address` are
  required, since they are stored on the shipment and appear on the label. Pass an
  `Idempotency-Key` and a repeated call returns the original shipment (`200`) rather than booking a
  second one (`201`). `getShipment` returns the current state, pricing and timeline;
  `cancelShipment` cancels before pickup, with an optional `reason`.
- **`rates`** — `calculateRates` prices a route against every courier that covers it and returns
  one quote each, so the choice is yours rather than the platform's. Each carries a `quote_id`, a
  `valid_until` (quotes are short-lived) and a `breakdown` itemising base rate, weight surcharge,
  zone addon, service multiplier and any distance overage, so a total reconciles line by line.
  Locate either end by `city` (always required, as the coarse filter), a named `zone`, exact
  `lat`/`lng`, or a free-form `place` that is resolved to coordinates — coordinates win, then a
  place name. Supplying coordinates matches the price to the bounded service area the point falls
  in, which a city name alone cannot do. `listZones` returns the cities currently serviceable, for
  populating a destination selector.
- **`tracking`** — two views of the same shipment. `trackShipment` takes the **tracking number**
  and returns the customer-facing view: status, estimated delivery, courier, and the scan events.
  `getShipmentTracking` takes the **shipment id** and returns the full record — a `full_timeline`
  with a timestamp for each state the shipment has entered (null for those it has not) and every
  event with coordinates and metadata. Use the first for a page you show a recipient, the second
  for reconciliation in your own backend.
- **`proofOfDelivery`** — `getProofOfDelivery` returns the evidence captured at handover for a
  delivered shipment: a photograph, a one-time code confirmed with the recipient, or a signature,
  according to what the shipment required. Available once the shipment reaches `delivered`.
- **`returns`** — the reverse leg, and the money that follows it. `requestReturn` lodges a return
  against a **delivered** order, naming a reason and the items concerned; it is checked against the
  merchant's policy — the accepted reasons and the return window — and refused if it falls outside.
  `listReturns` and `getReturn` track them (the detail view includes the per-item breakdown).
  `approveReturn` accepts one and chooses the resolution, creating the reverse shipment in the same
  step; `rejectReturn` declines it. `receiveReturn` marks the goods as arrived, and `resolveReturn`
  closes it — computing the refund, or dispatching a replacement for an exchange. The reason
  recorded at the start decides who bears the cost.
- **`webhooks`** — `createWebhook` registers an endpoint for a chosen set of events and returns the
  signing secret **once**, at creation. `listWebhooks` shows the registered endpoints with their
  current state, `deleteWebhook` removes one, and `testWebhook` sends a synthetic event so an
  integration can be verified before real traffic arrives. Delivery is retried on failure and an
  endpoint that keeps failing is disabled rather than retried indefinitely.
- **`system`** — `getApiInfo` returns the API version and the resource prefixes it serves;
  `getHealth` is a liveness check suitable for a monitor.

## Key usage by operation

Which key each operation needs. **`pk`** = publishable (browser-safe, **read-only**); **`sk`** =
secret (server-only, read and write).

The rule is the HTTP method, not the resource: **every write — create, update, cancel, approve,
resolve — requires a secret key**, and a publishable key attempting one is refused with a `403`
naming the reason. Reads accept either.

| Operation | Key |
| :--- | :--- |
| Rates — quote a route, list zones (`client.rates.*`) | `pk` or `sk` |
| Public tracking (`client.tracking.trackShipment`) | `pk` or `sk` |
| Detailed tracking (`client.tracking.getShipmentTracking`) | `pk` or `sk` |
| Proof of delivery (`client.proofOfDelivery.getProofOfDelivery`) | `pk` or `sk` |
| API info and health (`client.system.*`) | `pk` or `sk` |
| Read orders (`listOrders`, `getOrder`, `onDemandQuote`) | `pk` or `sk` |
| Create an order (`createOrder`) | **`sk`** |
| Edit, cancel or fulfil an order (`updateOrder`, `cancelOrder`, `fulfilOrder`, `fulfilOrderOnDemand`) | **`sk`** |
| Read shipments (`getShipment`) | `pk` or `sk` |
| Create or cancel a shipment (`createShipment`, `cancelShipment`) | **`sk`** |
| Read returns (`listReturns`, `getReturn`) | `pk` or `sk` |
| Lodge or progress a return (`requestReturn`, `approveReturn`, `rejectReturn`, `receiveReturn`, `resolveReturn`) | **`sk`** |
| Read webhook endpoints (`listWebhooks`) | `pk` or `sk` |
| Manage webhook endpoints (`createWebhook`, `deleteWebhook`, `testWebhook`) | **`sk`** |

## Usage examples

Reads accept either key, so those examples use `client` (a publishable-key client, safe in a
browser). Writes require a secret key and run on your server, so those use `server`:

```typescript
const client = new TLDP({ apiKey: 'tybrite_pk_live_…' }); // read-only, browser-safe
const server = new TLDP({ apiKey: 'tybrite_sk_live_…' }); // backend only
```


### Create and fulfil an order

```typescript
// Create an order (recipient + parcel). The response wraps the order object.
const { order } = await server.orders.createOrder({
  requestBody: {
    reference: 'ORDER-1042',
    delivery_method: 'last_mile',
    recipient: { name: 'Amina N.', phone: '+254700000000', city: 'Nairobi' },
    item: { description: 'Books', weight_kg: 1.2 },
  },
});

// Fulfil it with a chosen quote. Note: a quote's id is `quote_id` in the rates
// response, but fulfil takes it back as `rate_quote_id`.
const fulfilled = await server.orders.fulfilOrder({
  orderId: order.id,
  requestBody: {
    rate_quote_id: quotes[0].quote_id,
    delivery_method: 'last_mile',
  },
});

console.log(fulfilled.tracking_number);
```

### Rates by exact location

Pass coordinates or a free-form place for either endpoint and each courier's price is
matched to the bounded service area the point falls in — more precise than a city name.
Coordinates win; a `place` string is resolved to coordinates for you. For **door delivery**
(`delivery_method: 'last_mile'`) a destination beyond the service area may add a
`distance_overage` to `breakdown` — a courier-set surcharge for the extra distance. Pickup
at a station is never charged it.

```typescript
const { quotes } = await client.rates.calculateRates({
  requestBody: {
    origin:      { city: 'Nairobi', lat: -1.2864, lng: 36.8172 },  // exact point
    destination: { city: 'Nairobi', place: 'Upperhill, Nairobi' }, // resolved to a point
    weight_kg: 1.2,
    delivery_method: 'last_mile',
  },
});

const q = quotes[0];
console.log(q.total_price, q.breakdown.distance_overage); // e.g. 350, 50
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
const trip = await server.orders.fulfilOrderOnDemand({
  orderId: order.id,
  requestBody: { tier: 'scheduled' },
});
```

### Edit or cancel an order before it ships

An order is editable only while it is `pending_fulfilment`. Once fulfilled, a courier holds the
shipment and the call is refused with a `409` rather than letting the record drift from the label.

```typescript
const { order } = await server.orders.updateOrder({
  orderId,
  requestBody: {
    recipient: { notes: 'Leave with the gatekeeper.' },
  },
});

// Cancelling is likewise only possible before fulfilment.
await server.orders.cancelOrder({ orderId, requestBody: { reason: 'Customer changed their mind' } });
```

### Work with a shipment directly

Skip the order layer when the shipment is the unit of work.

```typescript
const { shipment } = await server.shipments.getShipment({ shipmentId });
console.log(shipment.status, shipment.pricing.total, shipment.timeline.estimated_delivery);

// Before pickup, a shipment can still be cancelled.
await server.shipments.cancelShipment({ shipmentId, requestBody: { reason: 'Out of stock' } });
```

### Detailed tracking for your own records

`trackShipment` is the customer view, keyed on the tracking number. `getShipmentTracking` is the
full record, keyed on the shipment id: a timestamp per state, plus every event.

```typescript
const detail = await client.tracking.getShipmentTracking({ shipmentId });

console.log(detail.status);
console.log(detail.full_timeline.picked_up_at);   // null until it happens
console.log(detail.events.length);                // oldest first
```

### Proof of delivery

Once a shipment is `delivered`, the evidence captured at handover is available — a photograph, a
one-time code confirmed with the recipient, or a signature, depending on what the shipment
required.

```typescript
const proof = await client.proofOfDelivery.getProofOfDelivery({ shipmentId });

console.log(proof.delivered_at);
console.log(proof.pod.type);            // 'photo' | 'signature' | 'otp'
console.log(proof.pod.verified_at);
console.log(proof.pod.data);            // the evidence itself, shaped by `type`
console.log(proof.recipient_confirmation.name);
```

`pod.data` differs by type: a photo carries `photo_path`, a signature carries `signature_path`
and `signed_by`, and a one-time code carries `verified` and `verified_by_phone`. A shipment with
no proof recorded yet answers `404` rather than an empty object.

### Drive a return to resolution

A return is lodged against a delivered order, then moves through approval, receipt and
resolution. The reason recorded at the start decides who bears the cost.

```typescript
const { return: created } = await server.returns.requestReturn({
  requestBody: {
    order_id: orderId,
    reason: 'damaged_in_transit',
    items: [{ sku: 'SKU-1', name: 'Running shoes', quantity: 1, unit_price: 5000 }],
    customer_note: 'Arrived crushed.',
  },
});

// Approving chooses the resolution and creates the reverse shipment in one step.
const approved = await server.returns.approveReturn({
  returnId: created.id,
  requestBody: { resolution: 'refund', merchant_note: 'Approved for refund.' },
});
console.log(approved.reverse_shipment_id);

await server.returns.receiveReturn({ returnId: created.id });     // goods are back
await server.returns.resolveReturn({ returnId: created.id, requestBody: { restock: true } });

// A request outside the merchant's policy is declined instead.
// await server.returns.rejectReturn({ returnId, requestBody: { merchant_note: 'Outside the window.' } });

// Read the current state at any point, including the per-item breakdown.
const detail = await client.returns.getReturn({ returnId: created.id });
```

### Manage webhook endpoints

The signing secret is returned **once**, when the endpoint is created. Store it then; it cannot be
read back afterwards.

```typescript
const { webhook } = await server.webhooks.createWebhook({
  requestBody: {
    url: 'https://example.com/hooks/tldp',
    events: ['shipment.delivered', 'return.resolved'],
  },
});
console.log(webhook.signing_secret); // shown once, at creation

const { webhooks } = await client.webhooks.listWebhooks();
await server.webhooks.testWebhook({ webhookId: webhook.id });   // send a synthetic event
await server.webhooks.deleteWebhook({ webhookId: webhook.id });
```

### Health and API info

```typescript
const info = await client.system.getApiInfo();     // version + the resources served
const health = await client.system.getHealth();    // liveness, for a monitor
```

### List with pagination

List endpoints return newest-first pages. Pass `limit` (1–100, default 50) and `offset`;
the response's `pagination` block tells you whether more pages exist and the `next_offset`
to request.

```typescript
let offset = 0;
const all = [];
for (;;) {
  const { orders, pagination } = await client.orders.listOrders({ limit: 100, offset });
  all.push(...orders);
  if (!pagination.has_more) break;
  offset = pagination.next_offset;
}
// client.returns.listReturns({ limit, offset }) pages the same way.
```

## Idempotency (safe retries)

Pass an `idempotencyKey` on write operations so a retried request never
double-creates. The same key returns the original result — this holds for both
`createOrder` and `createShipment`.

```typescript
const order = await server.orders.createOrder({
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
const { webhook } = await server.webhooks.createWebhook({
  requestBody: {
    url: 'https://yourapp.com/webhooks/tldp',
    events: ['shipment.delivered', 'order.fulfilled', 'return.refunded'],
  },
});
// webhook.signing_secret is shown ONCE — store it securely.

// Send yourself a realistic test event:
await server.webhooks.testWebhook({ webhookId: webhook.id });
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
