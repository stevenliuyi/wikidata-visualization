import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import WebFont from 'webfontloader'

WebFont.load({
  google: {
    families: [
      'Source Sans Pro:latin,latin-ext,greek,greek-ext,cyrillic,cyrillic-ext,vietnamese',
      'Montserrat:400,700',
      'Source Code Pro',
      'sans-serif'
    ]
  }
})

ReactDOM.render(<App />, document.getElementById('root'))
