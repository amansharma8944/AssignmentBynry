import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import ErrorBoundary from './component/ErrorBoudnry.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(

<StrictMode>
  <ErrorBoundary>
<Provider store={store}>

<BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>
  </ErrorBoundary>
  </StrictMode>,
)
