import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import api from './api'
import axios from 'axios'
import './static/style/body.scss'

window.api = api
window.axios = axios

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

