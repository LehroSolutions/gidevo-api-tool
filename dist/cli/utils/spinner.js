"use strict";
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Lightweight wrapper to dynamically import ESM-only 'ora' without breaking Jest (CJS) transpilation.
// Falls back to a no-op spinner when disabled or unavailable.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpinner = createSpinner;
function noopSpinner(initial) {
    const spinner = {
        start: () => spinner,
        stop: () => { },
        succeed: (text) => { if (text)
            console.log(text); },
        fail: (text) => { if (text)
            console.log(text); },
        text: initial,
    };
    return spinner;
}
async function createSpinner(message) {
    if (process.argv.includes('--no-spinner') || process.env.NO_SPINNER || !process.stdout.isTTY) {
        return noopSpinner(message);
    }
    try {
        const mod = await Promise.resolve().then(() => __importStar(require('ora')));
        const ora = mod.default || mod;
        // Avant-Garde Configuration
        return ora({
            text: message,
            color: 'magenta', // Closest to our Violet/Pink theme supported by ora
            spinner: 'dots12', // A more "digital" feel
            prefixText: '  ' // Indent to match our UI
        });
    }
    catch {
        return noopSpinner(message);
    }
}
//# sourceMappingURL=spinner.js.map