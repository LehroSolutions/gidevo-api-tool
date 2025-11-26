"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telemetry = exports.TelemetryService = void 0;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const logger_1 = require("./logger");
class ConsoleTelemetryProvider {
    track(event, properties) {
        if (process.env.TELEMETRY_DEBUG) {
            logger_1.logger.debug(`[Telemetry] Event: ${event}`, properties);
        }
    }
    captureException(error, properties) {
        if (process.env.TELEMETRY_DEBUG) {
            logger_1.logger.debug(`[Telemetry] Exception: ${error.message}`, properties);
        }
    }
}
class TelemetryService {
    constructor() {
        this.enabled = process.env.ENABLE_TELEMETRY === 'true';
        this.provider = new ConsoleTelemetryProvider();
        // Future: Initialize Sentry or other providers here based on env vars
        // if (process.env.SENTRY_DSN) { ... }
    }
    setTraceId(id) {
        this.traceId = id;
    }
    track(event, properties) {
        if (!this.enabled)
            return;
        this.provider.track(event, { traceId: this.traceId, ...properties });
    }
    captureException(error, properties) {
        if (!this.enabled)
            return;
        this.provider.captureException(error, { traceId: this.traceId, ...properties });
    }
}
exports.TelemetryService = TelemetryService;
exports.telemetry = new TelemetryService();
//# sourceMappingURL=telemetry.js.map