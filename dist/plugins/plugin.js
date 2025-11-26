"use strict";
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
exports.loadPlugins = loadPlugins;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Dynamically load all plugins from a directory.
 * @param pluginDir Absolute or relative path to plugins folder
 */
function loadPlugins(pluginDir) {
    const dir = path.resolve(pluginDir);
    if (!fs.existsSync(dir))
        return [];
    const plugins = [];
    for (const file of fs.readdirSync(dir)) {
        // Only load compiled JavaScript files, skip TypeScript declaration and source files
        if (!file.endsWith('.js'))
            continue;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(path.join(dir, file));
        const exportObj = mod.default || mod;
        const plugin = typeof exportObj === 'function' ? new exportObj() : exportObj;
        if (plugin && plugin.name && typeof plugin.run === 'function') {
            plugins.push(plugin);
        }
    }
    return plugins;
}
//# sourceMappingURL=plugin.js.map