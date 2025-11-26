export interface TelemetryProvider {
    track(event: string, properties?: any): void;
    captureException(error: Error, properties?: any): void;
}
export declare class TelemetryService {
    private provider;
    private enabled;
    private traceId?;
    constructor();
    setTraceId(id: string): void;
    track(event: string, properties?: any): void;
    captureException(error: Error, properties?: any): void;
}
export declare const telemetry: TelemetryService;
//# sourceMappingURL=telemetry.d.ts.map