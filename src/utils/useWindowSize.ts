import {useEffect, useState} from 'react';

export const useWindowWidth = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
};
