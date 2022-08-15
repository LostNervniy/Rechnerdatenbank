import { OperatingSystem } from './operating-system';

describe('OperatingSystem', () => {
  it('should create an instance', () => {
    expect(new OperatingSystem('', '', '')).toBeTruthy();
  });
});
