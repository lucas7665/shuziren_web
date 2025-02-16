import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import SimpleDemo from './pages/SimpleDemo'
import ChatDemo from './pages/ChatDemo'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.querySelector('#root') as Element).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/simple" element={<SimpleDemo />} />
      <Route path="/chat" element={<ChatDemo />} />
    </Routes>
  </BrowserRouter>
)
