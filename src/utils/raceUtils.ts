/**
 * shared race helpers - placements, etc
 */

export function getSortedPlacements(
  players: { forEach: (fn: (p: { placement?: number; displayName?: string }, id: string) => void) => void } | undefined
): { id: string; placement: number; displayName: string }[] {
  if (!players) return [];
  const entries: { id: string; placement: number; displayName: string }[] = [];
  players.forEach((p, id) => {
    const placement = p?.placement ?? 0;
    const displayName =
      typeof (p as { displayName?: unknown })?.displayName === 'string' &&
      (p as { displayName?: string }).displayName?.trim()
        ? (p as { displayName?: string }).displayName!.trim()
        : id;
    if (placement > 0) entries.push({ id, placement, displayName });
  });
  return entries.sort((a, b) => a.placement - b.placement);
}
