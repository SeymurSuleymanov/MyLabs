import { describe, it, expect, vi, beforeEach} from 'vitest';
import { csvToJSON } from './lab3';
import { formatCSVFileToJSONFile } from './lab3';
import * as fs from 'node:fs/promises';

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

  describe('Errors', () => {
    it('Trying throw if empty', () => {
    expect(() => csvToJSON([], ';'))
        .toThrow("Array can be empty!");
    });
    it('should throw if first row empty', () => {
      expect(() => csvToJSON([""], ';'))
        .toThrow("First row is empty!");
        });
    it('should throw if column length mismatch', () => {
      expect(() => csvToJSON(["p1;p2", "1;A;extra"], ';'))
        .toThrow("Not allied their lenht");
    });
    
    });
});

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

describe('formatCSVFileToJSONFile', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read csv and write json', async () => {

    const fakeCSV =
      "p1;p2\n" +
      "1;A\n" +
      "2;B";

    (fs.readFile as any).mockResolvedValue(fakeCSV);

    await formatCSVFileToJSONFile('input.csv', 'output.json', ';');

    expect(fs.readFile).toHaveBeenCalledWith('input.csv', 'utf-8');

    expect(fs.writeFile).toHaveBeenCalledWith(
      'output.json',
      JSON.stringify([
        { p1: "1", p2: "A" },
        { p1: "2", p2: "B" }
      ], null, 2),
      'utf-8'
    );
  });

  it('should throw "Error process file" if file empty', async () => {

    (fs.readFile as any).mockResolvedValue('');

    await expect(
      formatCSVFileToJSONFile('input.csv', 'output.json', ';')
    ).rejects.toThrow("Error process file");

  });

});