/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { OrdersService } from './services/OrdersService';
import { ProofOfDeliveryService } from './services/ProofOfDeliveryService';
import { RatesService } from './services/RatesService';
import { ReturnsService } from './services/ReturnsService';
import { ShipmentsService } from './services/ShipmentsService';
import { SystemService } from './services/SystemService';
import { TrackingService } from './services/TrackingService';
import { WebhooksService } from './services/WebhooksService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class TLDP {
    public readonly orders: OrdersService;
    public readonly proofOfDelivery: ProofOfDeliveryService;
    public readonly rates: RatesService;
    public readonly returns: ReturnsService;
    public readonly shipments: ShipmentsService;
    public readonly system: SystemService;
    public readonly tracking: TrackingService;
    public readonly webhooks: WebhooksService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'https://api.tybritelabs.com',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            apiKey: config?.apiKey,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.orders = new OrdersService(this.request);
        this.proofOfDelivery = new ProofOfDeliveryService(this.request);
        this.rates = new RatesService(this.request);
        this.returns = new ReturnsService(this.request);
        this.shipments = new ShipmentsService(this.request);
        this.system = new SystemService(this.request);
        this.tracking = new TrackingService(this.request);
        this.webhooks = new WebhooksService(this.request);
    }
}

