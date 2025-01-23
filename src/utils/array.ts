export function sort<T>(array: T[], compare: (a: T, b: T) => number) {
  return [...array].sort(compare);
}
