import type { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useMemo } from "react";

export type CurrentRoute<TQuery extends ParsedUrlQuery> = {
  push(queryUpdates: Partial<TQuery>): Promise<boolean>;
  replace(queryUpdates: Partial<TQuery>): Promise<boolean>;
  url(queryUpdates: Partial<TQuery>): { pathname: string; query: TQuery };
};

export const useCurrentRoute = <TQuery extends ParsedUrlQuery>() => {
  const router = useRouter();

  const query = router.query as TQuery;

  const currentRoute = useMemo<CurrentRoute<TQuery>>(
    () => ({
      push(queryUpdates: Partial<TQuery>) {
        return router.push(this.url(queryUpdates));
      },
      replace(queryUpdates: Partial<TQuery>) {
        return router.replace(this.url(queryUpdates));
      },
      url(queryUpdates: Partial<TQuery>) {
        // Construct a new Url object, merging in the new queryUpdates:
        const newUrl = {
          pathname: router.pathname,
          query: { ...router.query } as TQuery,
        };
        Object.entries(queryUpdates).forEach(([queryKey, newValue]) => {
          const key = queryKey as keyof TQuery;
          if (newValue === undefined) {
            delete newUrl.query[key];
          } else {
            newUrl.query[key] = newValue;
          }
        });

        return newUrl;
      },
    }),
    [router]
  );
  return [query, currentRoute] as const;
};
