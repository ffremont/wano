import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({ 
  "palette": { "common": { "black": "#000", "white": "#fff" }, 
  "background": { "paper": "#fff", "default": "#fafafa" },
   "primary": { "light": "rgba(74, 74, 74, 0.77)", 
   "main": "rgba(74, 74, 74, 1)", "dark": "rgba(61, 61, 62, 1)", "contrastText": "#fff" }, 
   "secondary": { "light": "rgba(255, 102, 0, 0.79)", "main": "rgba(255, 102, 0, 1)", 
   "dark": "rgba(192, 77, 0, 1)", "contrastText": "#fff" }, "error": { "light": "#e57373", "main": "#f44336", "dark": "#d32f2f", "contrastText": "#fff" }, "text": { "primary": "rgba(0, 0, 0, 0.87)", "secondary": "rgba(0, 0, 0, 0.54)", "disabled": "rgba(0, 0, 0, 0.38)", "hint": "rgba(0, 0, 0, 0.38)" } } });

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

