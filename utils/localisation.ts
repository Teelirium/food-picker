const rubFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  useGrouping: false,
});

export function toRubles(amount: number): string {
  return rubFormatter.format(amount);
}
