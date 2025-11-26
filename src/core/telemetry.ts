// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import { logger } from './logger';

export interface TelemetryProvider {
    track(event: string, properties?: any): void;
    captureException(error: Error, properties?: any): void;
}

class ConsoleTelemetryProvider implements TelemetryProvider {
    track(event: string, properties?: any): void {
        if (process.env.TELEMETRY_DEBUG) {
            logger.debug(`[Telemetry] Event: ${event}`, properties);
        }
    }

    captureException(error: Error, properties?: any): void {
        if (process.env.TELEMETRY_DEBUG) {
            logger.debug(`[Telemetry] Exception: ${error.message}`, properties);
        }
    }
}

export class TelemetryService {
    private provider: TelemetryProvider;
    private enabled: boolean;
    private traceId?: string;

    constructor() {
        this.enabled = process.env.ENABLE_TELEMETRY === 'true';
        this.provider = new ConsoleTelemetryProvider();

        // Future: Initialize Sentry or other providers here based on env vars
        // if (process.env.SENTRY_DSN) { ... }
    }

    setTraceId(id: string) {
        this.traceId = id;
    }

    track(event: string, properties?: any) {
        if (!this.enabled) return;
        this.provider.track(event, { traceId: this.traceId, ...properties });
    }

    captureException(error: Error, properties?: any) {
        if (!this.enabled) return;
        this.provider.captureException(error, { traceId: this.traceId, ...properties });
    }
}

export const telemetry = new TelemetryService();
