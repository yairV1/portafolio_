import { useEffect, useState, type RefObject } from 'react';

/** true mientras el elemento referenciado está (parcialmente) en el viewport. */
export function useIntersecting<T extends Element>(
  ref: RefObject<T | null>,
  threshold = 0.1,
): boolean {
  const [intersecting, setIntersecting] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return intersecting;
}
