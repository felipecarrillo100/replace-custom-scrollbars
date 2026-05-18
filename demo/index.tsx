import { createRoot } from 'react-dom/client';
import App from './App';
import './sass/app.scss';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
