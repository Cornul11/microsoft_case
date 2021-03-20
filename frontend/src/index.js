import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import App from "./App"
import DragAndDrop from "./DragAndDrop";
import DBPedia from "./bot/DBPedia";
import {ThemeProvider} from "styled-components";

ReactDOM.render(<DragAndDrop />, document.getElementById('root'));
// all available props
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#91bbb3',
  headerFontColor: '#fff',
  headerFontSize: '17px',
  botBubbleColor: '#91bbb3',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

ReactDOM.render(<React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root'));

ReactDOM.render(<ThemeProvider theme={theme}>
    <DBPedia />;
  </ThemeProvider>, document.getElementById('bot'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
