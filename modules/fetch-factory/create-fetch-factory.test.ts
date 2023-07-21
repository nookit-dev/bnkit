import { describe, expect, test } from "bun:test";
import { defaultErrorHandler } from "../..";
import { createFetchFactory } from "./create-fetch-factory";

type FetchArgs = {
  url: string;
  options: RequestInit;
};



// TODO: in order to properly test the methods, I'll need something like MSW to mock the fetch requests

describe("postJson method", () => {
  test("should make a POST request to the correct URL with JSON body", async () => {
    let fetchArgs: FetchArgs;
    global.fetch = async (url: string, options: RequestInit) => {
      fetchArgs = { url, options };
      return {
        ok: true,
        json: async () => ({ message: "Success" }),
      };
    };

    const fetchFactory = createFetchFactory({
      baseUrl: "https://api.example.com",
      errorHandler: defaultErrorHandler(),
    });
    const postData = { key: "value" };
    await fetchFactory.postJson({ endpoint: "/test", postData });

    expect(fetchArgs.url).toBe("https://api.example.com/test");
    expect(fetchArgs.options.method).toBe("POST");
    expect(fetchArgs.options.headers["Content-Type"]).toBe("application/json");
    expect(fetchArgs.options.body).toBe(JSON.stringify(postData));
  });
});

describe("postForm method", () => {
  test("should make a POST request to the correct URL with FormData body", async () => {
    let fetchArgs: FetchArgs;
    global.fetch = async (url: string, options: RequestInit) => {
      fetchArgs = { url, options };
      return {
        ok: true,
        json: async () => ({ message: "Success" }),
      };
    };
    const fetchFactory = createFetchFactory({
      baseUrl: "https://api.example.com",
      errorHandler: defaultErrorHandler(),
    });
    const formData = new FormData();
    formData.append("key", "value");
    await fetchFactory.postForm("/test", formData);

    expect(fetchArgs.url).toBe("https://api.example.com/test");
    expect(fetchArgs.options.method).toBe("POST");
    expect(fetchArgs.options.body).toBe(formData);
  });
});

describe("put method", () => {
  test("should make a PUT request to the correct URL with JSON body", async () => {
    let fetchArgs: FetchArgs;
    global.fetch = async (url: string, options: RequestInit) => {
      fetchArgs = { url, options };
      return {
        ok: true,
        json: async () => ({ message: "Success" }),
      };
    };

    const fetchFactory = createFetchFactory({
      baseUrl: "https://api.example.com",
      errorHandler: defaultErrorHandler(),
    });
    const putData = { key: "value" };
    await fetchFactory.put("/test", putData);

    expect(fetchArgs.url).toBe("https://api.example.com/test");
    expect(fetchArgs.options.method).toBe("PUT");
    expect(fetchArgs.options.headers["Content-Type"]).toBe("application/json");
    expect(fetchArgs.options.body).toBe(JSON.stringify(putData));
  });
});

describe("delete method", () => {
  test("should make a DELETE request to the correct URL", async () => {
    let fetchArgs: FetchArgs;
    global.fetch = async (url: string, options: RequestInit) => {
      fetchArgs = { url, options };
      return {
        ok: true,
        json: async () => ({ message: "Success" }),
      };
    };
    const fetchFactory = createFetchFactory({
      baseUrl: "https://api.example.com",
      errorHandler: defaultErrorHandler(),
    });
    await fetchFactory.delete("/test");

    expect(fetchArgs.url).toBe("https://api.example.com/test");
    expect(fetchArgs.options.method).toBe("DELETE");
  });
});
