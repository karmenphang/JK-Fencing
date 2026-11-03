import { transform, useTransform, type MotionValue } from 'motion/react'

/**
 * Scroll linked mapping that clamps cleanly at both ends.
 * Uses the function form of useTransform on purpose: Motion's natively
 * accelerated range form can snap back to the first keyframe once scroll
 * passes the end of the range in some Chromium builds.
 */
export function useRange<T extends string | number>(p: MotionValue<number>, input: number[], output: T[]) {
  const map = transform(input, output) as (v: number) => T
  return useTransform(p, (v) => map(v))
}
