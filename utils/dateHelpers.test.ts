import { addDaysToDate, getNextMonday, stripTimeFromDate } from './dateHelpers';

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

describe('stripTimeFromDate()', () => {
  it('should strip time correctly', () => {
    const initial = new Date('2023-04-01T08:08:08');
    const result = stripTimeFromDate(initial);
    expect(result.toISOString()).toEqual(new Date('2023-04-01').toISOString());
    expect(result.toISOString()).not.toEqual(initial.toISOString());
  });
});
