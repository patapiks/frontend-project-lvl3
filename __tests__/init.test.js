import sum from '../src/init';

test('sum', () => {
  const result = sum();
  expect(result).toEqual(2);
});
