import { addDays, getNextMonday, stripTimeFromDate } from './dateHelpers';

describe('getNextMonday', () => {
  it('works with a Monday', () => {
    const initial = new Date('2023-05-15');
    const result = getNextMonday(initial);
    expect(result.toISOString()).toEqual(new Date('2023-05-22').toISOString());
  });
  it('works with a Tuesday', () => {
    const initial = new Date('2023-03-21');
    const result = getNextMonday(initial);
    expect(result.toISOString()).toEqual(new Date('2023-03-27').toISOString());
  });
  it('works with a Sunday', () => {
    const initial = new Date('2023-03-26');
    const result = getNextMonday(initial);
    expect(result.toISOString()).toEqual(new Date('2023-03-27').toISOString());
  });
  it('works when crossing months', () => {
    const initial = new Date('2023-03-30');
    const result = getNextMonday(initial);
    expect(result.toISOString()).toEqual(new Date('2023-04-03').toISOString());
  });
});

describe('addDays', () => {
  it('adds days correctly', () => {
    const initial = new Date('2023-04-01');
    const result = addDays(initial, 4);
    expect(result.toISOString()).toEqual(new Date('2023-04-05').toISOString());
  });
});

describe('stripTimeFromDate', () => {
  it('strips time correctly', () => {
    const initial = new Date('2023-04-01T08:08:08');
    const result = stripTimeFromDate(initial);
    expect(result.toISOString()).toEqual(new Date('2023-04-01').toISOString());
    expect(result.toISOString()).not.toEqual(initial.toISOString());
  });
});
