import { act, renderHook } from "@testing-library/react-hooks";
import { memoryRouter } from "next-router-mock";

import { CurrentRoute, useCurrentRoute } from "./useCurrentRoute";

jest.mock("next/router", () => require("next-router-mock"));

describe("useCurrentRoute", () => {
  type RouteParams = { id: string; arg?: string };

  beforeEach(() => {
    // Set the mock route:
    memoryRouter.setMemoryRoute({
      pathname: "/foo/[id]/bar",
      query: { id: "ID" },
    });
  });

  let query: RouteParams, route: CurrentRoute<RouteParams>;
  beforeEach(() => {
    renderHook(() => {
      [query, route] = useCurrentRoute<RouteParams>();
    });
  });

  it("should return the current query values", () => {
    expect(query).toEqual({ id: "ID" });
  });

  it("should return a route with methods", () => {
    expect(route).toMatchObject({
      push: expect.any(Function),
      replace: expect.any(Function),
      url: expect.any(Function),
    });
  });

  it("should return the current route", () => {
    expect(query).toMatchObject({ id: "ID" });
  });

  it("should generate new URL objects", () => {
    expect(route.url({})).toMatchObject({
      pathname: "/foo/[id]/bar",
      query: {
        id: "ID",
      },
    });

    expect(route.url({ id: "NEW_ID" })).toMatchObject({
      query: { id: "NEW_ID" },
    });

    expect(route.url({ arg: "ARG" })).toMatchObject({
      query: { arg: "ARG", id: "ID" },
    });

    expect(route.url({ id: "NEW_ID", arg: "ARG" })).toMatchObject({
      query: { arg: "ARG", id: "NEW_ID" },
    });

    expect(route.url({ id: undefined, arg: "ARG" })).toMatchObject({
      query: { arg: "ARG" },
    });
  });

  it("should be able to push updated params", () => {
    act(() => {
      route.push({ id: "NEW_ID" });
    });
    expect(query).toMatchInlineSnapshot(`
      Object {
        "id": "NEW_ID",
      }
    `);

    act(() => {
      route.push({ id: "ANOTHER_ID" });
    });
    expect(query).toMatchInlineSnapshot(`
      Object {
        "id": "ANOTHER_ID",
      }
    `);
  });

  it("should be able to push new params, and delete them", () => {
    act(() => {
      route.push({ arg: "ARG" });
    });
    expect(query).toMatchInlineSnapshot(`
      Object {
        "arg": "ARG",
        "id": "ID",
      }
    `);

    act(() => {
      route.push({ arg: undefined });
    });
    expect(query).toMatchInlineSnapshot(`
      Object {
        "id": "ID",
      }
    `);
  });
});
