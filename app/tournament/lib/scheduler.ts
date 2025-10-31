export type Pairing = { home: string | null; away: string | null };
export type ScheduledMatch = {
  home_team_id: string | null;
  away_team_id: string | null;
  round: number;
};

function rotate<T>(arr: T[]) {
  if (arr.length <= 1) return arr;
  const first = arr[0];
  const rest = arr.slice(1);
  return [first, rest[rest.length - 1], ...rest.slice(0, rest.length - 1)];
}

/**
 * Generate round-robin pairings for team IDs.
 * If odd, inserts a null (BYE) team represented as null.
 */
export function generateRoundRobin(teamIds: string[]): ScheduledMatch[] {
  const teams = [...teamIds];
  const hasOdd = teams.length % 2 === 1;
  if (hasOdd) teams.push(null as any);

  const n = teams.length;
  const rounds = n - 1;
  const half = n / 2;
  const schedule: ScheduledMatch[] = [];

  let current = teams.slice();

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < half; i++) {
      const a = current[i];
      const b = current[n - 1 - i];
      // If either a or b is null, it's a BYE pairing
      schedule.push({
        home_team_id: a === null ? null : (a as string),
        away_team_id: b === null ? null : (b as string),
        round: r + 1
      });
    }
    // rotate all but first element
    const fixed = current[0];
    const rest = current.slice(1);
    current = [fixed, ...([rest[rest.length - 1], ...rest.slice(0, rest.length - 1)])];
  }

  return schedule;
}
