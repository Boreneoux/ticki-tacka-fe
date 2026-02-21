/**
 * Utility function to merge class names.
 * Filters out falsy values and joins with a space.
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
