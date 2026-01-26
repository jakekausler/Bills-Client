import { useEffect, useState } from 'react';
export function useElementAspectRatio(ref) {
    const [isSkinny, setIsSkinny] = useState(false);
    useEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const observer = new ResizeObserver(() => {
            if (element) {
                setIsSkinny(element.clientWidth / element.clientHeight < 1);
            }
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [ref]);
    return isSkinny;
}
