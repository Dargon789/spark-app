import { randomBytes } from 'crypto';

/**
 * Not cryptographically secure. Do not use for anything serious.
 */

export function randomHexId(): string {
  return randomBytes(8).toString('hex');
}
export function randomInt(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}
export function randomIntRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}
