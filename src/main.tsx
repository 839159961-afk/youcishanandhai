import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('找不到 #root 節點，請確認 index.html 中有 <div id="root"></div>。');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerSW({
  immediate: true,
});
