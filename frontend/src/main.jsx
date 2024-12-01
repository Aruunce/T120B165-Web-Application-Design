import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ErrorBoundary from './components/error/ErrorBoundary';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const backgroundAnimation = document.getElementById('background-animation');
const colors = [
  'rgba(255, 99, 132, 0.9)',  // Red
  'rgba(54, 162, 235, 0.9)',  // Blue
  'rgba(75, 192, 192, 0.9)',  // Teal
  'rgba(153, 102, 255, 0.9)', // Purple
  'rgba(255, 206, 86, 0.9)',  // Yellow
  'rgba(255, 159, 64, 0.9)',  // Orange
  'rgba(231, 233, 237, 0.9)'  // Light Gray
];

for (let i = 0; i < 20; i++) {
  const object = document.createElement('div');
  object.classList.add('object');
  object.style.top = `${Math.random() * 100}%`;
  object.style.left = `${Math.random() * 100}%`;
  object.style.animationDuration = `${10 + Math.random() * 10}s`;
  object.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  backgroundAnimation.appendChild(object);
}

export default App;