import { describe, it, expect } from 'vitest';
import { csvToJSON } from './lab3';
describe('csvToJSON', () => {

  describe('Correct input', () => {
    it('should convert csv to json', () => {
      const input = ["p1;p2;p3", "1;A;b", "2;B;v"];

      const expected = [
        { p1: "1", p2: "A", p3: "b" },
        { p1: "2", p2: "B", p3: "v" }
      ];

      expect(csvToJSON(input, ';')).toEqual(expected);
    });
  });

});