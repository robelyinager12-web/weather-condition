import React from 'react';

export function CardSkeleton({ height = 180 }) {
  return <div className="glass-card skeleton" style={{ height, width: '100%' }} />;
}

export function LineSkeleton({ width = '60%', height = 16 }) {
  return <div className="skeleton" style={{ width, height, marginBottom: 8 }} />;
}