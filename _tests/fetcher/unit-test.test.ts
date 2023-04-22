import { createFetcher } from "./fetcher";
import { handleError } from "error-handler-validation";

describe("createFetcher", () => {
  const baseUrl = "https://example.com/api/";
  const fetcher = createFetcher({ baseUrl });

  describe("get", () => {
    it("should retrieve data successfully", async () => {
      const result = await fetcher.get<{ data: string }>("data");
      expect(result.data).toEqual("test");
    });

    it("should throw an error if API returns an error status", async () => {
      const expectedError = handleError({ type: "APIError", message: "Not Found" });
      try {
        await fetcher.get("404");
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe("post", () => {
    it("should send data successfully and retrieve response", async () => {
      const result = await fetcher.post<{ data: string }>({
        endpoint: "data",
        params: { data: "test" },
      });
      expect(result.data).toEqual("test");
    });

    it("should send headers successfully", async () => {
      const result = await fetcher.post<{ headers: Record<string, any> }>({
        endpoint: "headers",
        params: { data: "test" },
        headers: { "X-Test-Header": "test" },
      });
      expect(result.headers).toEqual({ "X-Test-Header": "test" });
    });

    it("should throw an error if API returns an error status", async () => {
      const expectedError = handleError({ type: "APIError", message: "Not Found" });
      try {
        await fetcher.post("404", {});
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe("getStatus", () => {
    it("should retrieve headers successfully", async () => {
      const result = await fetcher.getStatus<{ headers: Record<string, any> }>("headers");
      expect(result.headers).toEqual({ "Content-Type": "application/json" });
    });

    it("should throw an error if API returns an error status", async () => {
      const expectedError = handleError({ type: "APIError", message: "Not Found" });
      try {
        await fetcher.getStatus("404");
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });
});

Note: This code is just an example and may not work as expected for your specific case. Please adapt it accordingly.