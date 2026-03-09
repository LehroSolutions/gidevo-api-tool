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
    // Resolve canonical (symlink-free) path and verify it matches the intended dir.
    // This prevents symlink-based path traversal attacks.
    let realDir;
    try {
        realDir = fs.realpathSync(dir);
    }
    catch {
        return [];
    }
    const plugins = [];
    for (const file of fs.readdirSync(realDir)) {
        // Only load compiled JavaScript files, skip TypeScript declaration and source files
        if (!file.endsWith('.js'))
            continue;
        // Ensure the filename contains no path separators (prevents traversal via filenames)
        if (path.basename(file) !== file)
            continue;
        const pluginPath = path.join(realDir, file);
        let pluginStat;
        try {
            pluginStat = fs.lstatSync(pluginPath);
        }
        catch {
            continue;
        }
        if (!pluginStat.isFile() || pluginStat.isSymbolicLink())
            continue;
        // Verify each plugin file resolves within the allowed directory (symlink-safe)
        let realPluginPath;
        try {
            realPluginPath = fs.realpathSync(pluginPath);
        }
        catch {
            continue;
        }
        if (!realPluginPath.startsWith(realDir + path.sep) && realPluginPath !== realDir)
            continue;
        // nosemgrep: gidevo-dynamic-require-approved
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(realPluginPath);
        const exportObj = mod.default || mod;
        const plugin = typeof exportObj === 'function' ? new exportObj() : exportObj;
        if (plugin && plugin.name && typeof plugin.run === 'function') {
            plugins.push(plugin);
        }
    }
    return plugins;
}
//# sourceMappingURL=plugin.js.map