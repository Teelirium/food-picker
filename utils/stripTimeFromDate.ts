export default function stripTimeFromDate(date: Date) {
  return new Date(date.toJSON().split('T')[0]);
}
