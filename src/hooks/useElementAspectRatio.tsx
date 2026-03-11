import React, { useCallback, useEffect, useRef, useState } from 'react';

export function useElementAspectRatio(ref: React.RefObject<HTMLElement>) {
  const [isSkinny, setIsSkinny] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);

  const handleElementChange = useCallback((element: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!element) return;

    observerRef.current = new ResizeObserver(() => {
      const ratio = element.clientHeight > 0 ? element.clientWidth / element.clientHeight : 0;
      setIsSkinny(ratio < 1);
    });

    observerRef.current.observe(element);
  }, []);

  useEffect(() => {
    const element = ref.current;
    handleElementChange(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [ref, handleElementChange]);

  return isSkinny;
}
