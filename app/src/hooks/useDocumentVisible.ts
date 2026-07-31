import { useEffect, useState } from 'react';

/** true mientras la pestaña está visible (pausa animaciones en pestañas ocultas). */
export function useDocumentVisible(): boolean {
  const [visible, setVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return visible;
}
