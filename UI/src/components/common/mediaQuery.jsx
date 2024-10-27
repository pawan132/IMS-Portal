import { useState, useEffect } from 'react';

const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = (e) => {
    setTargetReached(e.matches);
  };

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener('change', updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener('change', updateTarget);
  }, [width]);

  return targetReached;
};

export default useMediaQuery;
