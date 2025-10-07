// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Lightweight wrapper to dynamically import ESM-only 'ora' without breaking Jest (CJS) transpilation.
// Falls back to a no-op spinner when disabled or unavailable.

export interface SpinnerLike {
  start?: () => SpinnerLike;
  stop: () => void;
  succeed?: (text?: string) => void;
  fail?: (text?: string) => void;
  text?: string;
}

function noopSpinner(initial: string): SpinnerLike {
  return {
    stop: () => { /* no-op */ },
    succeed: (text?: string) => { if (text) console.log(text); },
    fail: (text?: string) => { if (text) console.log(text); },
    text: initial,
  };
}

export async function createSpinner(message: string): Promise<SpinnerLike> {
  if (process.argv.includes('--no-spinner') || process.env.NO_SPINNER || !process.stdout.isTTY) {
    return noopSpinner(message);
  }
  try {
    const mod = await import('ora');
    const ora = (mod as any).default || mod;
    return ora(message);
  } catch {
    return noopSpinner(message);
  }
}
