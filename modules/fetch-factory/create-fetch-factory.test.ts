import { describe, expect, test } from "bun:test";
import { createFetchFactory } from "./create-fetch-factory";
// add type

type FetchArgs = {
  url: string;
  options: RequestInit;
};

describe("post method", () => {
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
      defaultHeaders: {
        Authorization: "Bearer token", // new default header for demonstration
      },
      config: {
        test: {
          endpoint: "/test",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      },
    });
    const postData = { key: "value" };
    await fetchFactory.post({ endpoint: "test", body: postData });

    expect(fetchArgs.url).toBe("https://api.example.com/test");
    expect(fetchArgs.options.method).toBe("POST");
    // TODO: fix header tests
    // expect(fetchArgs.options.headers.get("Content-Type")).toBe(
    //   "application/json"
    // );
    // expect(fetchArgs.options.headers.get("Authorization")).toBe("Bearer token");
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
      config: {
        test: {
          endpoint: "/test",
          method: "POST",
        },
      },
    });
    const formData = new FormData();
    formData.append("key", "value");
    await fetchFactory.postForm({ endpoint: "test", bodyData: formData });

    expect(fetchArgs.url).toBe("https://api.example.com/test");
    expect(fetchArgs.options.method).toBe("POST");
    expect(fetchArgs.options.headers.get("Content-Type")).toContain(
      "multipart/form-data"
    );
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
      config: {
        test: {
          endpoint: "/test",
          method: "DELETE",
        },
      },
    });
    await fetchFactory.delete({ endpoint: "test" });

    expect(fetchArgs.url).toBe("https://api.example.com/test");
    expect(fetchArgs.options.method).toBe("DELETE");
  });
});
