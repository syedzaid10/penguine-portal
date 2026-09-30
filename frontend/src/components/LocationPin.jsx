import React from 'react';

/**
 * Custom Polar Location Pin Icon
 * Renders the official Antarctica contour map pin marker icon.
 */
export default function LocationPin({ className = 'w-3.5 h-3.5', alt = 'Polar Station Location' }) {
  return (
    <img
      src="/images/polar-location-pin.png"
      alt={alt}
      className={`inline-block object-contain flex-shrink-0 align-middle ${className}`}
      loading="lazy"
    />
  );
}
