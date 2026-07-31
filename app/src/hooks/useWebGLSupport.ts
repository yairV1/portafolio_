import { useState } from 'react';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function useWebGLSupport(): boolean {
  const [supported] = useState(detectWebGL);
  return supported;
}
