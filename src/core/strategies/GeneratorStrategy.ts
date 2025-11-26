// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions

export interface GeneratorStrategy {
  generate(spec: any, outputDir: string): Promise<void>;
}
