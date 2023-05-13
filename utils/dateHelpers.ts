export function getNextMonday(date: Date): Date {
  const dateCopy = new Date(date.getTime());
  const nextMonday = new Date(
    dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7) || 7),
  );
  return nextMonday;
}

/**
 * Mutates the given date
 */
export function addDays(date: Date, dayCount: number): Date {
  date.setDate(date.getDate() + dayCount);
  return date;
}

export function stripTimeFromDate(date: Date): Date {
  return new Date(date.toJSON().split('T')[0]);
}
