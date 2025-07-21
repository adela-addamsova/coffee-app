import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 *
 * Automatically scrolls the window to the top whenever the pathname changes,
 * except when there is a hash in the URL
 *
 * @returns {null} Does not render any visible UI
 */

function ScrollToTop(): null {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
