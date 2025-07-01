import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';

// Set metadata
document.title = "Prescriptioner";

// Basic metadata
const metaDescription = document.createElement('meta');
metaDescription.name = "description";
metaDescription.content = "Revolutionary AI-powered prescription scanning that automatically creates intelligent medication reminders in your Google Calendar";
document.head.appendChild(metaDescription);

// Favicon
const favicon = document.createElement('link');
favicon.rel = "icon";
favicon.href = "/icon.png";
document.head.appendChild(favicon);

// Open Graph metadata
const ogTitle = document.createElement('meta');
ogTitle.property = "og:title";
ogTitle.content = "Prescriptioner";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = "og:description";
ogDescription.content = "Revolutionary AI-powered prescription scanning that automatically creates intelligent medication reminders in your Google Calendar";
document.head.appendChild(ogDescription);

const ogImage = document.createElement('meta');
ogImage.property = "og:image";
ogImage.content = "/og-image.jpg";
document.head.appendChild(ogImage);

const ogUrl = document.createElement('meta');
ogUrl.property = "og:url";
ogUrl.content = window.location.origin;
document.head.appendChild(ogUrl);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <App />
    </BrowserRouter>
);