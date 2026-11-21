export function overtimeAmountCents(monthlySalaryCents: number, hours: number, multiplier = 1.25) {
  return Math.round((monthlySalaryCents / 30 / 8) * hours * multiplier);
}

export function leaveDays(start: Date, end: Date) {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
}
