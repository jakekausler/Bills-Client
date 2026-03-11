import React, { useEffect, useState } from 'react';

export function useElementAspectRatio(ref: React.RefObject<HTMLElement>) {
  const [isSkinny, setIsSkinny] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      if (element) {
        const ratio = element.clientHeight > 0 ? element.clientWidth / element.clientHeight : 0;
        setIsSkinny(ratio < 1);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return isSkinny;
}
