// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Lightweight wrapper to dynamically import ESM-only 'ora' without breaking Jest (CJS) transpilation.
// Falls back to a no-op spinner when disabled or unavailable.

import { ui } from './ui';

export interface SpinnerLike {
  start?: () => SpinnerLike;
  stop: () => void;
  succeed?: (text?: string) => void;
  fail?: (text?: string) => void;
  text?: string;
  color?: string;
}

function noopSpinner(initial: string): SpinnerLike {
  const spinner = {
    start: () => spinner,
    stop: () => { /* no-op */ },
    succeed: (text?: string) => { if (text) console.log(text); },
    fail: (text?: string) => { if (text) console.log(text); },
    text: initial,
  };
  return spinner;
}

export async function createSpinner(message: string): Promise<SpinnerLike> {
  if (process.argv.includes('--no-spinner') || process.env.NO_SPINNER || !process.stdout.isTTY) {
    return noopSpinner(message);
  }
  try {
    const mod = await import('ora');
    const ora = (mod as any).default || mod;
    
    // Avant-Garde Configuration
    return ora({
      text: message,
      color: 'magenta', // Closest to our Violet/Pink theme supported by ora
      spinner: 'dots12', // A more "digital" feel
      prefixText: '  ' // Indent to match our UI
    });
  } catch {
    return noopSpinner(message);
  }
}
