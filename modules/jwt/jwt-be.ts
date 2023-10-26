import crypto from "crypto";
import {
  createJwtHeader,
  decodeJwt,
  decrypt,
  encodeJwt,
  encrypt,
  isTokenExpired,
  payloadValidator,
} from "./jwt-server-utils";
import { JwtHeader, JwtPayload, RefreshToken } from "./jwt-types";

export interface JwtHandlers {
  getInvalidTokens: () => Promise<string[]>;
  addInvalidToken: (token: string) => Promise<void>;
  getRefreshTokens: () => Promise<RefreshToken[]>;
  saveRefreshToken: (token: RefreshToken) => Promise<void>;
  removeRefreshToken: (token: string) => Promise<void>;
}

// backend  jwt handling
export const jwtBack = (factorySecret: string, handlers: JwtHandlers) => {
  async function generateRefreshToken(): Promise<string> {
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // Token valid for one week
    const tokenData = { token: refreshToken, exp: expiresIn };
    await handlers.saveRefreshToken(tokenData);
    return refreshToken;
  }

  async function validateRefreshToken(token: string): Promise<boolean> {
    if (await isValidToken(token)) {
      return false;
    }

    const refreshTokens = await handlers.getRefreshTokens();
    const refreshToken = refreshTokens.find((t) => t.token === token);
    if (!refreshToken) {
      return false;
    }
    if (refreshToken.exp < Math.floor(Date.now() / 1000)) {
      await handlers.removeRefreshToken(token);
      return false;
    }
    return true;
  }

  async function invalidateToken(token: string): Promise<void> {
    await handlers.addInvalidToken(token);
  }

  async function isValidToken(token: string): Promise<boolean> {
    const blacklist = await handlers.getInvalidTokens();
    return blacklist.includes(token);
  }

  function createJwt(
    payload: JwtPayload,
    secret: string = factorySecret,
    expiresIn: number = 60 * 60
  ): string {
    try {
      payloadValidator(payload);
    } catch (e) {
      throw new Error("Invalid Payload");
    }

    const header = createJwtHeader();
    payload.exp = Math.floor(Date.now() / 1000) + expiresIn;

    const jwt = encodeJwt(header, payload, secret);
    return encrypt(jwt, secret);
  }

  async function verifyJwt(
    token: string,
    secret: string = factorySecret
  ): Promise<{ header: JwtHeader; payload: JwtPayload }> {
    const decryptedToken = decrypt(token, secret);

    if (await isValidToken(token)) {
      throw new Error("This token is blacklisted");
    }

    const { header, payload } = decodeJwt(decryptedToken, secret);

    if (isTokenExpired(payload)) {
      throw new Error("Token expired");
    }

    return { header, payload };
  }

  return {
    createJwt,
    verifyJwt,
    generateRefreshToken,
    validateRefreshToken,
    invalidateToken,
  };
};
