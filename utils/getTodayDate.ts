export default function getTodayDate() {
  return new Date(new Date().toJSON().split("T")[0]);
}
