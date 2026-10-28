// ============================================================
//  utils.js – shared pure utilities
// ============================================================

/**
 * Format an ISO timestamp into a human-readable relative string.
 * Falls back gracefully for null / invalid dates.
 */
export function fmtTime(isoStr) {
  if (!isoStr) return 'Unknown';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return 'Unknown';
  const diff  = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins} minute${mins  === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours  === 1 ? '' : 's'} ago`;
  if (days  < 7)  return `${days} day${days     === 1 ? '' : 's'} ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Derive two-letter initials from a full name.
 */
export function makeInitials(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
