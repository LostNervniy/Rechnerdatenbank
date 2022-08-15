import { Computer } from './computer';

describe('Computer', () => {
  it('should create an instance', () => {
    expect(new Computer(null, null, null, null, null, null, null, null, '', null, '', null, '')).toBeTruthy();
  });
});
