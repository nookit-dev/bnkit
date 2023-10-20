import { describe, expect, test } from "bun:test";
import { jwtServerSideFactory } from "./jwt-server-side-factory";

describe("jwtServerSideFactory", () => {
  const factorySecret = "secret";
  const jwtFactory = jwtServerSideFactory(factorySecret);

  test("createJwt", () => {
    const payload = { id: 1, roles: ["admin"] };
    const jwt = jwtFactory.createJwt(payload, "secret", 3600);

    // The JWT should be a string and have 3 parts when split by '.'
    expect(typeof jwt).toBe("string");
    expect(jwt.split(".").length).toBe(3);
  });

  test("verifyJwt", () => {
    const payload = { id: 1, roles: ["admin"] };
    const jwt = jwtFactory.createJwt(payload, "secret", 3600);

    const { header, payload: decodedPayload } = jwtFactory.verifyJwt(
      jwt,
      "secret"
    );

    // The header should match the one we set in createJwt
    expect(header).toEqual({ alg: "HS256", typ: "JWT" });

    // The payload should include the data we passed to createJwt
    expect(decodedPayload.id).toBe(payload.id);
    expect(decodedPayload.roles).toEqual(payload.roles);
  });

  test("generateRefreshToken", () => {
    const refreshToken = jwtFactory.generateRefreshToken();

    // The refresh token should be a string
    expect(typeof refreshToken).toBe("string");
  });

  test("validateRefreshToken", () => {
    const refreshToken = jwtFactory.generateRefreshToken();
    const isValid = jwtFactory.validateRefreshToken(refreshToken);

    // The refresh token should be valid
    expect(isValid).toBeTruthy();
  });

  test("blacklistToken", () => {
    const refreshToken = jwtFactory.generateRefreshToken();
    jwtFactory.blacklistToken(refreshToken);

    // After blacklisting, the refresh token should be invalid
    const isValid = jwtFactory.validateRefreshToken(refreshToken);
    expect(isValid).toBeFalsy();
  });
});
