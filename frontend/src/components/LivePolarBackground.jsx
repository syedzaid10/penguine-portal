import React from 'react';
import { useLocation } from 'react-router-dom';

export default function LivePolarBackground() {
  const location = useLocation();

  // Leave the first home page intact: on "/", Home.jsx maintains its original
  // hero and feature strip, and attaches this long scrolling background to all the other sections below it.
  // For all other pages (/library, /datasets, /gallery, /activities, /student-zone, /news, /ask),
  // this renders the clear, visible, unblurred long background image.
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden select-none bg-slate-900"
    >
      <img
        src="/images/solitary-penguin-journey.jpg"
        alt="Antarctic Solitary Penguin Journey"
        className="w-full h-full object-cover object-top block"
        style={{ imageRendering: 'high-quality' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/glacier-mountains-sea.jpg';
        }}
      />
    </div>
  );
}
