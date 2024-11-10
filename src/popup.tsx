import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';

// Render the App component to the popup’s root element
// ReactDOM.render(<App />, document.getElementById('root'));
const container = document.getElementById('app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);
