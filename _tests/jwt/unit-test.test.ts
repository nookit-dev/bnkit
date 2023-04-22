import { jwtClient, jwtServer } from "./jwt";

describe("jwtClient", () => {
  const token =
    "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAiMTIzNDU2Nzg5MCIsICJuYW1lIjogIkpvaG4gRG9lIiwgImV4cCI6IDE2MzE3NzUyMzB9.N-U7yC5d5FK5fTSI5fdevUG_7ZjS8MfVfydX9Yde1Vg";

  it("should decode a JWT token", () => {
    const result = jwtClient().decodeJwt(token);

    expect(result).toEqual({
      header: {
        alg: "HS256",
        typ: "JWT",
      },
      payload: {
        sub: "1234567890",
        name: "John Doe",
        exp: 1631775230,
      },
    });
  });

  it("should detect an expired JWT token", () => {
    const expiredToken =
      "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAiMTIzNDU2Nzg5MCIsICJuYW1lIjogIkpvaG4gRG9lIiwgImV4cCI6IDE2MzE3ODA3NjB9.i2mkVoJEG5d5WaDGK5MzRZzc5JZwSf8ACp7dL9tweY4";
    
    const result = jwtClient().isJwtExpired(expiredToken);

    expect(result).toEqual(true);
  });

  it("should return false for a non-expired JWT token", () => {
    const result = jwtClient().isJwtExpired(token);

    expect(result).toEqual(false);
  });
});

describe("jwtServer", () => {
  const secret = "mySecret";

  it("should create a JWT token", () => {
    const payload = {
      sub: "1234567890",
      name: "John Doe",
    };
    
    const result = jwtServer(secret).createJwt(payload, secret, 3600);

    expect(result).toBeDefined();
  });

  it("should verify a valid JWT token", () => {
    const payload = {
      sub: "1234567890",
      name: "John Doe",
    };
    const token = jwtServer(secret).createJwt(payload, secret, 3600);

    const result = jwtServer(secret).verifyJwt(token, secret);

    expect(result).toEqual({
      header: {
        alg: "HS256",
        typ: "JWT",
      },
      payload: {
        sub: "1234567890",
        name: "John Doe",
        exp: expect.any(Number),
      },
    });
  });

  it("should throw an error for an invalid JWT token", () => {
    const invalidToken =
      "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAiMTIzNDU2Nzg5MCIsICJuYW1lIjogIkpvaG4gRG9lIiwgImV4cCI6IDE2MzE3NzUyMzB9.N-U7yC5d5FK5fTSI5fdevUG_7ZjS8MfVfydX9Ydx1Vg";

    expect(() => jwtServer(secret).verifyJwt(invalidToken, secret)).toThrow(
      "Invalid signature"
    );
  });

  it("should throw an error for an expired JWT token", () => {
    const payload = {
      sub: "1234567890",
      name: "John Doe",
      exp: Math.floor(Date.now() / 1000) - 3600,
    };
    const expiredToken = jwtServer(secret).createJwt(payload, secret);

    expect(() => jwtServer(secret).verifyJwt(expiredToken, secret)).toThrow(
      "Token expired"
    );
  });
});