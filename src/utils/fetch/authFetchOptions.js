import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function useAuthFetchOptions() {
  const { accessToken } = useOutletContext() ?? {};

  return useMemo(
    () =>
      accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {},
    [accessToken],
  );
}
