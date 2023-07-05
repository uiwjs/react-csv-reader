import { forwardRef } from 'react';
import { parse, ParseConfig, ParseResult, ParseWorkerConfig, ParseLocalConfig, LocalFile } from 'papaparse';

export interface IFileInfo {
  name: string;
  size: number;
  type: string;
  modifiedAt: number;
}

export interface CSVReaderProps<T,  TFile extends LocalFile = LocalFile> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onError'> {
  strict?: boolean;
  encoding?: string;
  parserOptions?: Partial<ParseWorkerConfig<T>> & Partial<ParseLocalConfig<T>> & ParseConfig<T, TFile>;
  onError?: (error: Error) => void;
  onFileLoaded: (data: Array<any>, fileInfo: IFileInfo, originalFile?: File) => void;
}

const CSVReader = forwardRef<HTMLInputElement, CSVReaderProps<unknown>>((props, ref) => {
  const { 
    accept = '.csv, text/csv',
    encoding = 'UTF-8',
    onError = () => {},
    parserOptions = {},
    onFileLoaded,
    onChange,
    strict = false,
    ...reset
  } = props;
  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event);
    let reader: FileReader = new FileReader()
    const files: FileList = event.target.files!
    if (files.length > 0) {
      const fileInfo: IFileInfo = {
        name: files[0].name,
        size: files[0].size,
        type: files[0].type,
        modifiedAt: files[0].lastModified,
      }

      if (strict && accept.indexOf(fileInfo.type) <= 0) {
        onError(new Error(`[strict mode] Accept type not respected: got '${fileInfo.type}' but not in '${accept}'`))
        return
      }

      reader.onload = (_event: Event) => {
        const csvData = parse(reader.result as any, {
          ...parserOptions,
          error: onError,
          encoding: encoding,
        } as unknown as CSVReaderProps<any, any>['parserOptions']) as unknown as ParseResult<any>;
        onFileLoaded && onFileLoaded(csvData?.data ?? [], fileInfo, files[0]);
      }

      reader.readAsText(files[0], encoding)
    }
  }
  return (
    <input type="file" name="w-csv-reader-input" {...reset} onChange={handleChangeFile} accept={accept} ref={ref} />
  );
});

export default CSVReader;