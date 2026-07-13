import * as path from 'path';
import { fileURLToPath } from 'url';

export function dirnameFromMetaUrl(metaUrl: string): string {
  return path.dirname(fileURLToPath(metaUrl));
}

export function filenameFromMetaUrl(metaUrl: string): string {
  return fileURLToPath(metaUrl);
}
