// Ensures a promise takes at least `ms` to resolve, so fast responses don't just flash a loading indicator.
export const withMinDuration = <T>(promise: Promise<T>, ms = 300): Promise<T> =>
  Promise.all([promise, new Promise((resolve) => setTimeout(resolve, ms))]).then(
    ([result]) => result,
  );
