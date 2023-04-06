import getNextMonday from './getNextMonday';

describe('getNextMonday()', () => {
  it('should return date of the next monday', () => {
    const initial = new Date('2023-03-21');
    const result = getNextMonday(initial);
    expect(result.toISOString()).toEqual(new Date('2023-03-27').toISOString());
  });
});
