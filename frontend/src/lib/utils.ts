// Utility: cn (classNames) for conditional class merging
export function cn(...args: (string | undefined | false | null)[]): string {
  return args.filter(Boolean).join(" ");
}
