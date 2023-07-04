import { forwardRef } from 'react';
import { parse, ParseConfig } from 'papaparse';

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
  onFileLoaded: (data: Array<any>, fileInfo: IFileInfo, originalFile?: File) => void;
}

const CSVReader = forwardRef<HTMLInputElement, CSVReaderProps>((props, ref) => {
  const { 
    accept = '.csv, text/csv',
    fileEncoding = 'UTF-8',
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
          encoding: fileEncoding,
        } as ParseConfig);
        onFileLoaded && onFileLoaded(csvData?.data ?? [], fileInfo, files[0]);
      }

      reader.readAsText(files[0], fileEncoding)
    }
  }
  return (
    <input type="file" name="w-csv-reader-input" {...reset} onChange={handleChangeFile} accept={accept} ref={ref} />
  );
});

export default CSVReader;