import GitHubCorners from '@uiw/react-github-corners';
import CSVReader from '@uiw/react-csv-reader';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { styled } from "goober";
import { CSSProperties, useState } from 'react';
import MarkdownPreview from './Markdown';

const Header = styled('header')`
  padding: 2rem 0;
  text-align: center;
  h1 {
    font-weight: 900;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji';
  }
`;

const SupVersion = styled('sup')`
  font-weight: 200;
  font-size: 0.78rem;
  margin-left: 0.5em;
  margin-top: -0.3em;
  position: absolute;
`;

const Wrappper = styled('div')`
  padding-bottom: 5rem;
`;

const Examples = styled('div')`
  text-align: left;
  display: inline-block;
`;

export default function App() {
  const [value, setValue] = useState<any[]>([]);
  return (
    <Wrappper>
      <GitHubCorners fixed target="__blank" zIndex={10} href="https://github.com/uiwjs/react-csv-reader" />
      <Header>
        <h1>
        CSV Reader for React<SupVersion>v{VERSION}</SupVersion>
        </h1>
        <Examples>
          <CSVReader
            parserOptions={{
              // header: true,
              // worker: true,
            }}
            onFileLoaded={(data) => {
              setValue(data);
              console.log('data:', data)
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
      </Header>
      <MarkdownPreview />
    </Wrappper>
  );
}
