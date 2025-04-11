/**
 * Parses a time string into minutes
 * @param timeStr Time string in format like "1h30m", "45m", "2h", "1d"
 * @returns Number of minutes or null if invalid format
 */
export function parseTime(timeStr: string): number | null {
  // Match patterns like "1h30m", "45m", "2h", "1d"
  const timeMatch = timeStr.match(/^(\d+)([mhd])(?:\s*(\d+)([mh]))?$/);
  if (!timeMatch) {
    return null;
  }

  const [, amount1, unit1, amount2, unit2] = timeMatch;
  let totalMinutes = 0;

  // Parse first unit
  const value1 = parseInt(amount1);
  switch (unit1) {
    case "m":
      totalMinutes += value1;
      break;
    case "h":
      totalMinutes += value1 * 60;
      break;
    case "d":
      totalMinutes += value1 * 24 * 60;
      break;
    default:
      return null;
  }

  // Parse second unit if present
  if (amount2 && unit2) {
    const value2 = parseInt(amount2);
    switch (unit2) {
      case "m":
        totalMinutes += value2;
        break;
      case "h":
        totalMinutes += value2 * 60;
        break;
      default:
        return null;
    }
  }

  return totalMinutes;
} 