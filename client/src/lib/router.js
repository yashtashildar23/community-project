import { useEffect, useState } from 'react';

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

/** Tiny hash router — no extra dependency, works from a static file or PWA. */
export function useRoute() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return path;
}

export function navigate(path) {
  if (currentPath() === path) return;
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: 'auto' });
}
