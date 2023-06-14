export function getNextMonday(date: Date): Date {
  const dateCopy = new Date(date.getTime());
  const nextMonday = new Date(
    dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7)),
  );
  return nextMonday;
}

export function addDays(date: Date, dayCount: number): Date {
  const dateCopy = new Date(date.getTime());
  dateCopy.setDate(dateCopy.getDate() + dayCount);
  return dateCopy;
}

export function stripTimeFromDate(date: Date): Date {
  return new Date(date.toISOString().split('T')[0]);
}
