import './sass/app.scss';
import { createRoot } from 'react-dom/client';

import DefaultScrollbarsApp from './components/DefaultScrollbars/App';
import ColoredScrollbarsApp from './components/ColoredScrollbars/App';
import SpringScrollbarsApp from './components/SpringScrollbars/App';
import ShadowScrollbarsApp from './components/ShadowScrollbars/App';
import NativeScrollbarsApp from './components/NativeScrollbars/App';

const defaultRoot = document.getElementById('default-scrollbars-root');
if (defaultRoot) createRoot(defaultRoot).render(<DefaultScrollbarsApp />);

const coloredRoot = document.getElementById('colored-scrollbars-root');
if (coloredRoot) createRoot(coloredRoot).render(<ColoredScrollbarsApp />);

const springRoot = document.getElementById('spring-scrollbars-root');
if (springRoot) createRoot(springRoot).render(<SpringScrollbarsApp />);

const shadowRoot = document.getElementById('shadow-scrollbars-root');
if (shadowRoot) createRoot(shadowRoot).render(<ShadowScrollbarsApp />);

const nativeRoot = document.getElementById('native-scrollbars-root');
if (nativeRoot) createRoot(nativeRoot).render(<NativeScrollbarsApp />);
