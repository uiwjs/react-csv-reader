react-csv-reader
===

[![CI](https://github.com/uiwjs/react-csv-reader/actions/workflows/ci.yml/badge.svg)](https://github.com/uiwjs/react-csv-reader/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@uiw/react-csv-reader.svg)](https://www.npmjs.com/package/@uiw/react-csv-reader)
[![NPM Downloads](https://img.shields.io/npm/dm/@uiw/react-csv-reader.svg?style=flat&label=)](https://www.npmjs.com/package/@uiw/react-csv-reader)

React component that handles csv file input and its parsing. <!--rehype:ignore:start-->Example Preview: [uiwjs.github.io/react-csv-reader](https://uiwjs.github.io/react-csv-reader/)<!--rehype:ignore:end-->

## Quick Start

```bash
npm install @uiw/react-csv-reader
```

```jsx
import CSVReader from '@uiw/react-csv-reader';

<CSVReader
  onFileLoaded={(data, iFileInfo, iOriginalFile, text) => { }}
/>
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
        onFileLoaded={(data, iFileInfo, iOriginalFile, text) => {
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

**parserOptions**

```tsx mdx:preview
import React, { useState } from 'react';
import CSVReader from '@uiw/react-csv-reader';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';

export default function Demo() {
  const [parserOptions, setParserOptions] = useState({
    header: true
  });
  const [value, setValue] = useState([]);
  const [fileInfo, setFileInfo] = useState();
  const [originalFile, setOriginalFile] = useState();

  const change = (evn) => {
    console.log('evn:', evn.target.id)
    console.log('evn:', evn.target.checked)
    
    setParserOptions({ ...parserOptions, [evn.target.id]: evn.target.checked })
  }
  return (
    <React.Fragment>
      <CSVReader
        parserOptions={parserOptions}
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
      <div style={{ background: '#fff', padding: 10 }}>
        <label>
          <input type="checkbox" id="stream" checked={!!parserOptions.stream} onChange={change} /> Stream
          <p style={{ whiteSpace :'pre-wrap' }}>Results are delivered row by row to a step function. Use with large inputs that would crash the browser.</p>
        </label>
        <label>
          <input type="checkbox" id="worker" checked={!!parserOptions.worker} onChange={change} /> Worker thread
          <p style={{ whiteSpace :'pre-wrap' }}>Uses a separate thread so the web page doesn't lock up. </p>
        </label>
        <label>
          <input type="checkbox" id="header" checked={!!parserOptions.header} onChange={change} /> Header row
          <p style={{ whiteSpace :'pre-wrap' }}>Keys data by field name rather than an array. </p>
        </label>
        <label>
          <input type="checkbox" id="dynamicTyping" checked={!!parserOptions.dynamicTyping} onChange={change} /> Dynamic typing
          <p style={{ whiteSpace :'pre-wrap' }}>Turns numeric data into numbers and true/false into booleans. </p>
        </label>
        <label>
          <input type="checkbox" id="skipEmptyLines" checked={!!parserOptions.skipEmptyLines} onChange={change} /> Skip empty lines
          <p style={{ whiteSpace :'pre-wrap' }}>By default, empty lines are parsed; check to skip. </p>
        </label>
      </div>

      {value && value.length > 0 && <JsonView keyName="data" value={value} collapsed={false} style={lightTheme} />}
      {fileInfo && <JsonView keyName="fileInfo" value={fileInfo} collapsed={false} style={darkTheme} />}
      {originalFile && <JsonView keyName="new File()" value={Object.assign(originalFile)} collapsed={false} style={lightTheme} />}
    </React.Fragment>
  );
}
```

**Get csv raw text content**

The original text can also be obtained using `await iOriginalFile.text()`.

```tsx mdx:preview
import React, { useState } from 'react';
import CSVReader from '@uiw/react-csv-reader';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';

export default function Demo() {
  const [value, setValue] = useState('');
  return (
    <React.Fragment>
      <CSVReader
        onFileLoaded={(data, iFileInfo, iOriginalFile, text) => {
          setValue(text);
        }}
      />
      {value && value.length > 0 && (
        <pre>{value}</pre>
      )}
    </React.Fragment>
  );
}
```

## Props

```ts
import { ParseConfig, ParseWorkerConfig, ParseLocalConfig, LocalFile } from 'papaparse';
export interface IFileInfo {
  name: string;
  size: number;
  type: string;
  modifiedAt: number;
}
export interface CSVReaderProps<T, TFile extends LocalFile = LocalFile> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onError'> {
  strict?: boolean;
  encoding?: string;
  parserOptions?: Partial<ParseWorkerConfig<T>> & Partial<ParseLocalConfig<T>> & ParseConfig<T, TFile>;
  onError?: (error: Error) => void;
  onFileLoaded: (data: Array<any>, fileInfo: IFileInfo, originalFile?: File, text?: string) => void;
}
declare const CSVReader: import("react").ForwardRefExoticComponent<CSVReaderProps<unknown, LocalFile> & import("react").RefAttributes<HTMLInputElement>>;
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

```ts
export interface ParseWorkerConfig<T = any> extends ParseConfig<T> {
  /**
   * Whether or not to use a worker thread.
   * Using a worker will keep your page reactive, but may be slightly slower.
   */
  worker: true;
  /**
   * The callback to execute when parsing is complete.
   * It receives the parse results. If parsing a local file, the File is passed in, too.
   * When streaming, parse results are not available in this callback.
   */
  complete(results: ParseResult<T>): void;
}
```


```ts
// Base interface for all async parsing
interface ParseAsyncConfigBase<T = any, TInput = undefined> extends ParseConfig<T, TInput> {
  /**
   * Whether or not to use a worker thread.
   * Using a worker will keep your page reactive, but may be slightly slower.
   * @default false
   */
  worker?: boolean | undefined;
  /**
   * Overrides `Papa.LocalChunkSize` and `Papa.RemoteChunkSize`.
   */
  chunkSize?: number | undefined;
  /**
   * A callback function, identical to `step`, which activates streaming.
   * However, this function is executed after every chunk of the file is loaded and parsed rather than every row.
   * Works only with local and remote files.
   * Do not use both `chunk` and `step` callbacks together.
   */
  chunk?(results: ParseResult<T>, parser: Parser): void;
  /**
   * A callback to execute if FileReader encounters an error.
   * The function is passed two arguments: the error and the File.
   */
  error?(error: Error, file: TInput): void;
}

// Async parsing local file can specify encoding
interface ParseLocalConfigBase<T = any, TInput = undefined> extends ParseAsyncConfigBase<T, TInput> {
  /** The encoding to use when opening local files. If specified, it must be a value supported by the FileReader API. */
  encoding?: string | undefined;
}

interface ParseLocalConfigStep<T = any, TInput = undefined> extends ParseLocalConfigBase<T, TInput> {
  /** @inheritdoc */
  step(results: ParseStepResult<T>, parser: Parser): void;
}
interface ParseLocalConfigNoStep<T = any, TInput = undefined> extends ParseLocalConfigBase<T, TInput> {
  /** @inheritdoc */
  complete(results: ParseResult<T>, file: TInput): void;
}

// Local parsing is async and thus must specify either `step` or `complete` (but may specify both)
export type ParseLocalConfig<T = any, TInput = undefined> = ParseLocalConfigStep<T, TInput> | ParseLocalConfigNoStep<T, TInput>;
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
