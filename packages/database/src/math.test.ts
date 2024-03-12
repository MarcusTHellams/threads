import * as math from './math';

describe('Test math functions', () => {
  it('should equal 6', () => {
    expect(math.add(3, 3)).toBe(6);
  });
  it('should equal 6', () => {
    expect(math.subtract(12, 6)).toBe(6);
  });
  it('should equal 6', () => {
    expect(math.multiply(2, 3)).toBe(6);
  });
  it('should equal 6', () => {
    expect(math.divide(36, 6)).toBe(6);
  });
});
