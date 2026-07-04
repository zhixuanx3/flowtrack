import { useEffect, useRef } from "react";

export function useNearBottomScroll(onNearBottom: () => void, enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // scrollHeight - scrollTop - clientHeight = pixels remaining below the visible area.
      if (scrollHeight - scrollTop - clientHeight < 100) {
        onNearBottom();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [enabled, onNearBottom]);

  return containerRef;
}
