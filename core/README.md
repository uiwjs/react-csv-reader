react-csv-reader
===

React component that handles csv file input and its parsing.


## Quick Start

```bash
npm install @uiw/react-csv-reader
```

```jsx
import CSVReader from '@uiw/react-csv-reader';

<CSVReader />
```


## Example

```tsx mdx:preview
import React, { useState } from 'react';
import CSVReader from '@uiw/react-csv-reader';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';

export default function Demo() {
  const [value, setValue] = useState([]);
  return (
    <React.Fragment>
      <CSVReader
        onFileLoaded={(data, iFileInfo, iOriginalFile) => {
          setValue(data);
        }}
      />
      {value && value.length > 0 && (
        <JsonView
          keyName="data"
          value={value}
          collapsed={false}
          style={lightTheme}
        />
      )}
    </React.Fragment>
  );
}
```

```tsx mdx:preview
import React, { useState } from 'react';
import CSVReader from '@uiw/react-csv-reader';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';

export default function Demo() {
  const [value, setValue] = useState([]);
  const [fileInfo, setFileInfo] = useState();
  const [originalFile, setOriginalFile] = useState();
  return (
    <React.Fragment>
      <CSVReader
        onFileLoaded={(data, iFileInfo, iOriginalFile) => {
          setValue(data);
          setFileInfo(iFileInfo);
          const fileData = {};
          for (let file in iOriginalFile) {
            fileData[file] = iOriginalFile[file];
          }
          setOriginalFile(fileData);
        }}
      />
      {value && value.length > 0 && <JsonView keyName="data" value={value} collapsed={false} style={lightTheme} />}
      {fileInfo && <JsonView keyName="fileInfo" value={fileInfo} collapsed={false} style={darkTheme} />}
      {originalFile && <JsonView keyName="new File()" value={Object.assign(originalFile)} collapsed={false} style={lightTheme} />}
    </React.Fragment>
  );
}
```

## Props

```ts
import { ParseConfig } from 'papaparse';
export interface IFileInfo {
  name: string;
  size: number;
  type: string;
  modifiedAt: number;
}
export interface CSVReaderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onError'> {
  strict?: boolean;
  fileEncoding?: string;
  parserOptions?: ParseConfig;
  onError?: (error: Error) => void;
  onFileLoaded: (data: Array<any>, fileInfo: IFileInfo, originalFile?: File) => any;
}
declare const CSVReader: import("react").ForwardRefExoticComponent<CSVReaderProps & import("react").RefAttributes<HTMLInputElement>>;
export default CSVReader;
```

```ts
export interface ParseConfig<T = any, TInput = undefined> {
  /**
   * The delimiting character.
   * Leave blank to auto-detect from a list of most common delimiters, or any values passed in through `delimitersToGuess`.
   * It can be a string or a function.
   * If a string, it can be of any length (so multi-character delimiters are supported).
   * If a function, it must accept the input as first parameter and it must return a string which will be used as delimiter.
   * In both cases it cannot be found in `Papa.BAD_DELIMITERS`.
   * @default // auto-detect
   */
  delimiter?: string | ((input: string) => string) | undefined;
  /**
   * The newline sequence. Leave blank to auto-detect. Must be one of `\r`, `\n`, or `\r\n`.
   * @default // auto-detect
   */
  newline?: '\r' | '\n' | '\r\n' | undefined;
  /**
   * The character used to quote fields. The quoting of all fields is not mandatory. Any field which is not quoted will correctly read.
   * @default '"'
   */
  quoteChar?: string | undefined;
  /**
   * The character used to escape the quote character within a field.
   * If not set, this option will default to the value of `quoteChar`,
   * meaning that the default escaping of quote character within a quoted field is using the quote character two times.
   * (e.g. `"column with ""quotes"" in text"`)
   * @default '"'
   */
  escapeChar?: string | undefined;
  /**
   * If `true`, the first row of parsed data will be interpreted as field names.
   * An array of field names will be returned in meta, and each row of data will be an object of values keyed by field name instead of a simple array.
   * Rows with a different number of fields from the header row will produce an error.
   * Warning: Duplicate field names will overwrite values in previous fields having the same name.
   * @default false
   */
  header?: boolean | undefined;
  /**
   * A function to apply on each header. Requires header to be true. The function receives the header as its first argument and the index as second.
   */
  transformHeader?(header: string, index: number): string;
  /**
   * If `true`, numeric and boolean data will be converted to their type instead of remaining strings.
   * Numeric data must conform to the definition of a decimal literal.
   * Numerical values greater than 2^53 or less than -2^53 will not be converted to numbers to preserve precision.
   * European-formatted numbers must have commas and dots swapped.
   * If also accepts an object or a function.
   * If object it's values should be a boolean to indicate if dynamic typing should be applied for each column number (or header name if using headers).
   * If it's a function, it should return a boolean value for each field number (or name if using headers) which will be passed as first argument.
   * @default false
   */
  dynamicTyping?:
      | boolean
      | { [headerName: string]: boolean; [columnNumber: number]: boolean }
      | ((field: string | number) => boolean)
      | undefined;
  /** If > 0, only that many rows will be parsed. */
  preview?: number | undefined;
  /**
   * A string that indicates a comment (for example, "#" or "//").
   * When Papa encounters a line starting with this string, it will skip the line.
   * @default false
   */
  comments?: false | string | undefined;
  /**
   * If `true`, lines that are completely empty (those which evaluate to an empty string) will be skipped.
   * If set to `'greedy'`, lines that don't have any content (those which have only whitespace after parsing) will also be skipped.
   * @default false
   */
  skipEmptyLines?: boolean | 'greedy' | undefined;
  /**
   * Fast mode speeds up parsing significantly for large inputs.
   * However, it only works when the input has no quoted fields.
   * Fast mode will automatically be enabled if no " characters appear in the input.
   * You can force fast mode either way by setting it to true or false.
   */
  fastMode?: boolean | undefined;
  /**
   * A function to apply on each value.
   * The function receives the value as its first argument and the column number or header name when enabled as its second argument.
   * The return value of the function will replace the value it received.
   * The transform function is applied before `dynamicTyping`.
   */
  transform?(value: string, field: string | number): any;
  /**
   * An array of delimiters to guess from if the delimiter option is not set.
   * @default [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
   */
  delimitersToGuess?: string[] | undefined;
  /**
   * To stream the input, define a callback function.
   * Streaming is necessary for large files which would otherwise crash the browser.
   * You can call parser.abort() to abort parsing.
   * And, except when using a Web Worker, you can call parser.pause() to pause it, and parser.resume() to resume.
   */
  step?(results: ParseStepResult<T>, parser: Parser): void;
  /**
   * The callback to execute when parsing is complete.
   * It receives the parse results. If parsing a local file, the File is passed in, too.
   * When streaming, parse results are not available in this callback.
   */
  complete?(results: ParseResult<T>, file: TInput): void;
  /**
   * A function to execute before parsing the first chunk.
   * Can be used with chunk or step streaming modes.
   * The function receives as an argument the chunk about to be parsed, and it may return a modified chunk to parse.
   * This is useful for stripping header lines (as long as the header fits in a single chunk).
   */
  beforeFirstChunk?(chunk: string): string | void;
}
```

## Development

Runs the project in development mode.  

```bash
# Step 1, run first, listen to the component compile and output the .js file
# listen for compilation output type .d.ts file
npm run watch
# Step 2, development mode, listen to compile preview website instance
npm run start
```

Builds the app for production to the build folder.

```bash
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/uiwjs/react-csv-reader/graphs/contributors">
  <img src="https://uiwjs.github.io/react-csv-reader/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License.
