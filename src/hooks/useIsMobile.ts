import { useState, useEffect } from 'react';

export const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  
  // Check user agent for mobile device patterns
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|windows phone|tablet/i.test(userAgent);
  
  // Fallback: If it's a touch device with a small screen
  const isSmallScreenTouch = window.matchMedia('(max-width: 768px)').matches && 
                           ('ontouchstart' in window || navigator.maxTouchPoints > 0);
                           
  return isMobileDevice || isSmallScreenTouch;
};

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(getIsMobile());

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
