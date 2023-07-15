import CSVReader from '@uiw/react-csv-reader';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { styled } from "goober";
import { CSSProperties, useState } from 'react';

const Examples = styled('div')`
  text-align: left;
  display: inline-block;
`;

export default function App() {
  const [value, setValue] = useState<any[]>([]);
  return (
    <Examples>
      <CSVReader
        parserOptions={{
          // header: true,
          // worker: true,
        }}
        onFileLoaded={async (data, iFileInfo, iOriginalFile) => {
          setValue(data);
          const txt = await iOriginalFile?.text()
          console.log('data:', data, iFileInfo, iOriginalFile, txt)
        }}
      />
      {value && value.length > 0 && (
        <JsonView
          keyName="data"
          value={value}
          collapsed={false}
          style={lightTheme as CSSProperties}
        />
      )}
    </Examples>
  );
}
