import { RefObject, useEffect } from "react";

type Event = MouseEvent | TouchEvent;

/**
 * Hook that handles click outside of the passed ref
 * @param ref - Ref object or array of ref objects to check against
 * @param handler - Callback function to execute when click outside is detected
 * @param enabled - Optional boolean to enable/disable the hook
 */
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: Event) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: Event) => {
      const refs = Array.isArray(ref) ? ref : [ref];
      const target = event.target as Node;

      if (refs.some((r) => !r.current) || !target) return;

      if (refs.some((r) => r.current?.contains(target))) return;

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
};
