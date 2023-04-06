import { addDaysToDate, getNextMonday } from './dateHelpers';

describe('getNextMonday()', () => {
  it('should return date of the next monday', () => {
    const initial = new Date('2023-03-21');
    const result = getNextMonday(initial);
    expect(result.toISOString()).toEqual(new Date('2023-03-27').toISOString());
  });
});

describe('addDaysToDate()', () => {
  it('should add days correctly', () => {
    const initial = new Date('2023-04-01');
    const result = addDaysToDate(initial, 4);
    expect(result.toISOString()).toEqual(new Date('2023-04-05').toISOString());
  });
});
