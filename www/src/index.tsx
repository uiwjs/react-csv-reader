import React from 'react';
import { createRoot } from 'react-dom/client';
import '@wcj/dark-mode';
import App from './App';
import { glob, setup } from 'goober';

setup(React.createElement);

glob`
  [data-color-mode*='dark'], [data-color-mode*='dark'] body {
    --tabs-bg: #5f5f5f;
  }
  [data-color-mode*='light'], [data-color-mode*='light'] body {
    background-color: #f2f2f2;
    --tabs-bg: #bce0ff;
  }
  * {
    box-sizing: border-box;
  }
`;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.Fragment>
    <dark-mode
      permanent
      dark="Dark"
      light="Light"
      style={{ position: 'fixed', top: 8, left: 12, zIndex: 99, fontSize: 32 }}
    />
    <App />
  </React.Fragment>,
);
