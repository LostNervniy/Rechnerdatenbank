import { Mainboard } from './mainboard';

describe('Mainboard', () => {
  it('should create an instance', () => {
    expect(new Mainboard(null, '', '', '', null, '', null, null, null, null, '')).toBeTruthy();
  });
});
