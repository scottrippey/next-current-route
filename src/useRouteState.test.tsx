import { act, renderHook } from "@testing-library/react-hooks";
import router from "next/router";
import { RouteStateSetter, useRouteState } from "./useRouteState";

jest.mock("next/router", () => require("next-router-mock"));

describe("useRouteState", () => {
  type RouteParams = { id: string; search?: string };

  beforeEach(() => {
    // Set the mock route:
    router.replace({
      pathname: "/foo/[id]/bar",
      query: { id: "ID" },
    });
  });

  let id: string;
  let setId: RouteStateSetter<string>;
  let search: RouteParams["search"];
  let setSearch: RouteStateSetter<RouteParams["search"]>;
  beforeEach(() => {
    renderHook(() => {
      [id, setId] = useRouteState<RouteParams>("id");
      [search, setSearch] = useRouteState<RouteParams>("search");
    });
  });

  it("id and search should be populated correctly", () => {
    expect(id).toEqual("ID");
    expect(search).toEqual(undefined);
  });

  it("should be able to set new values", () => {
    act(() => {
      setId("123");
    });
    expect(id).toEqual("123");
    expect(search).toEqual(undefined);
    expect(router.asPath).toEqual("/foo/123/bar");

    act(() => {
      setSearch("TEST");
    });
    expect(id).toEqual("123");
    expect(search).toEqual("TEST");
    expect(router.asPath).toEqual("/foo/123/bar?search=TEST");

    act(() => {
      setSearch(undefined);
    });
    expect(id).toEqual("123");
    expect(search).toEqual(undefined);
    expect(router.asPath).toEqual("/foo/123/bar");
  });

  it("can generate URLs too", () => {
    expect(setId("123", "url")).toEqual({
      pathname: "/foo/[id]/bar",
      query: { id: "123" },
    });

    expect(setSearch("TEST", "url")).toEqual({
      pathname: "/foo/[id]/bar",
      query: { id: "ID", search: "TEST" },
    });
  });
});
