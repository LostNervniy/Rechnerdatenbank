import { Pcie } from './pcie';

describe('Pcie', () => {
  it('should create an instance', () => {
    expect(new Pcie('', '', '')).toBeTruthy();
  });
});
