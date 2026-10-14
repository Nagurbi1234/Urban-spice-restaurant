import { useCallback, useEffect, useState } from "react";

/**
 * Generic data-fetching hook. Re-runs whenever `deps` change.
 * Returns { data, isLoading, isError, error, refetch }.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetcher()
      .then((result) => setData(result))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, isError: !!error, error, refetch: run };
}

/**
 * Hook for mutation-style requests (create/update/delete).
 * Returns { mutate, isPending, isError, error }.
 */
export function useMutation(mutationFn) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    (variables, { onSuccess, onError } = {}) => {
      setIsPending(true);
      setError(null);
      return mutationFn(variables)
        .then((result) => {
          onSuccess?.(result);
          return result;
        })
        .catch((err) => {
          setError(err);
          onError?.(err);
          throw err;
        })
        .finally(() => setIsPending(false));
    },
    [mutationFn]
  );

  return { mutate, isPending, isError: !!error, error };
}
