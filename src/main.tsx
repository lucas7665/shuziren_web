import ReactDOM from 'react-dom/client'
import './index.scss'
// import App from './vm-ui/vm-app/index.tsx'
import SimpleDemo from './pages/SimpleDemo'

ReactDOM.createRoot(document.querySelector('#root') as Element).render(
  <SimpleDemo />
)
