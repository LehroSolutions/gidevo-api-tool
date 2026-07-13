// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions

export interface GeneratorStrategy {
  generate(
    spec: any,
    outputDir: string,
    options?: { allowOutsideProject?: boolean }
  ): Promise<void>;
}
