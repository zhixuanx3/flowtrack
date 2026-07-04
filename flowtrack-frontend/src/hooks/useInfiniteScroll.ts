import { useEffect, useRef, useState } from "react";

export interface PageResult<T> {
  items: T[];
  hasMore: boolean;
}

const MIN_LOADING_MS = 300;

export function useInfiniteScroll<T>(
  fetchPage: (page: number) => Promise<PageResult<T>>,
) {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPage = async (pageNum: number) => {
    setIsLoading(true);
    // Ensures the loading state is visible for at least MIN_LOADING_MS, so fast
    // responses don't just flash the loading indicator.
    const [result] = await Promise.all([
      fetchPage(pageNum),
      new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
    ]);
    setItems((prev) =>
      pageNum <= 1 ? result.items : [...prev, ...result.items],
    );
    setHasMore(result.hasMore);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page > 1) loadPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // scrollHeight - scrollTop - clientHeight = pixels remaining below the visible area.
      if (
        scrollHeight - scrollTop - clientHeight < 100 &&
        hasMore &&
        !isLoading
      ) {
        setPage((p) => p + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  return { items, hasMore, isLoading, containerRef };
}
