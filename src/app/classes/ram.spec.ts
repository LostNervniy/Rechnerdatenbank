import { Ram } from './ram';

describe('Ram', () => {
  it('should create an instance', () => {
    expect(new Ram('', '', '', null, null)).toBeTruthy();
  });
});
