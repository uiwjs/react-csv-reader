import { screen, render } from '@testing-library/react';
import CSVReader from './';

it('renders <CSVReader /> test case', () => {
  render(<CSVReader data-testid="csvreader" onFileLoaded={(data, iFileInfo, iOriginalFile, text) => {}} />);
  const csvreader = screen.getByTestId('csvreader');
  expect(csvreader.parentElement?.tagName).toBe('DIV');
  expect(csvreader.tagName).toBe('INPUT');
  expect(csvreader).toHaveProperty('accept', '.csv, text/csv');
  expect(csvreader).toHaveProperty('name', 'w-csv-reader-input');
  expect(csvreader).toHaveProperty('type', 'file');
});
