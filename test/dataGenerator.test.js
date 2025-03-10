//test/dataGenerator.test.js
import { generateFullData } from '../src/utils/dataGenerator.js';

describe('generateFullData', () => {
  it('should generate person data', () => {
    const data = generateFullData('person', 2);
    expect(data).toHaveLength(2);
    expect(data[0]).toHaveProperty('firstName');
    expect(data[0]).toHaveProperty('lastName');
  });

  it('should throw an error for unsupported types', () => {
    expect(() => generateFullData('unsupported', 1)).toThrow('Unsupported data type');
  });
});
