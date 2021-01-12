import { useCallback } from "react";
import type { ParsedUrlQuery } from "querystring";
import { useCurrentRoute } from "./useCurrentRoute";

export type RouteMethod = "replace" | "push" | "url";
export type RouteStateSetter<TValue> = {
  (newValue: TValue, method?: "replace" | "push"): Promise<boolean>;
  (newValue: TValue, method: "url"): ParsedUrlQuery;
};

export const useRouteState = <TQuery extends ParsedUrlQuery = ParsedUrlQuery>(
  queryKey: keyof TQuery
) => {
  type TValue = TQuery[typeof queryKey];

  const [query, route] = useCurrentRoute<TQuery>();

  const value: TValue = query[queryKey];

  const setValue = useCallback<RouteStateSetter<TValue>>(
    (newValue: TValue, method: RouteMethod = "replace") => {
      const queryUpdates = {
        [queryKey]: newValue,
      } as Partial<TQuery>;

      return route[method](queryUpdates) as any;
    },
    [route]
  );

  return [value, setValue] as const;
};
