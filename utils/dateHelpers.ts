export function getNextMonday(date: Date): Date {
  const dateCopy = new Date(date.getTime());
  const nextMonday = new Date(
    dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7) || 7),
  );
  return nextMonday;
}

export function addDaysToDate(date: Date, dayCount: number): Date {
  const dateCopy = new Date(date.valueOf());
  dateCopy.setDate(dateCopy.getDate() + dayCount);
  return dateCopy;
}
