import { Software } from './software';

describe('Software', () => {
  it('should create an instance', () => {
    // @ts-ignore
    expect(new Software('', '')).toBeTruthy();
  });
});
