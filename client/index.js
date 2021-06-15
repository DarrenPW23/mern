require('file-loader?name=[name].[ext]!./index.html')

import React from 'react';
import { render } from 'react-dom';
import App from './Components/App.jsx'

render(<App />, document.getElementById('app'))

if (module.hot) {
    module.hot.accept()
}