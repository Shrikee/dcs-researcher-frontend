import { useCallback, useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 1023px)');
}

export function useSidebar() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const closeIfMobile = useCallback(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  return { open, setOpen, close, toggle, closeIfMobile };
}
