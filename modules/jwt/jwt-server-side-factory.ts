import crypto from "crypto";

interface JwtHeader {
  alg: string;
  typ: string;
}

interface JwtPayload {
  exp?: number;
  roles?: string[];
  [key: string]: any;
}

interface RefreshToken {
  token: string;
  exp: number;
}

function payloadValidator(payload: JwtPayload): boolean {
  // Add more validation as per your requirements
  if (!payload) {
    throw new Error("Payload cannot be empty");
  }
  return true;
}

function base64UrlEncode(str: string): string {
  const base64 = Buffer.from(str).toString("base64");
  return base64.replace("+", "-").replace("/", "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  str = str.replace("-", "+").replace("_", "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString();
}

function sign(data: string, secret: string): string {
  // TODO: maybe use hash factory here?
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("base64");
}

export const jwtServerSideFactory = (factorySecret: string) => {
  const tokenBlacklist: string[] = [];
  const refreshTokens: RefreshToken[] = [];

  function generateRefreshToken(): string {
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // Token valid for one week
    refreshTokens.push({ token: refreshToken, exp: expiresIn });
    return refreshToken;
  }

  function validateRefreshToken(token: string): boolean {
    // Check if the token is blacklisted before validating it
    if (isTokenBlacklisted(token)) {
      return false;
    }

    const index = refreshTokens.findIndex((t) => t.token === token);
    if (index === -1) {
      return false;
    }
    const refreshToken = refreshTokens[index];
    if (refreshToken.exp < Math.floor(Date.now() / 1000)) {
      refreshTokens.splice(index, 1); // Remove expired token
      return false;
    }
    return true;
  }

  function blacklistToken(token: string): void {
    tokenBlacklist.push(token);
  }

  function isTokenBlacklisted(token: string): boolean {
    return tokenBlacklist.includes(token);
  }

  function createJwt(
    payload: JwtPayload,
    secret: string,
    expiresIn: number = 60 * 60
  ): string {
    if (!payloadValidator(payload)) {
      throw new Error("Invalid payload");
    }

    const header: JwtHeader = { alg: "HS256", typ: "JWT" };
    const headerJson = JSON.stringify(header);
    const headerEncoded = base64UrlEncode(headerJson);

    payload.exp = Math.floor(Date.now() / 1000) + expiresIn;
    const payloadJson = JSON.stringify(payload);
    const payloadEncoded = base64UrlEncode(payloadJson);

    const signature = sign(`${headerEncoded}.${payloadEncoded}`, secret);
    const signatureEncoded = base64UrlEncode(signature);

    return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
  }

  function verifyJwt(
    token: string,
    secret: string = factorySecret
  ): { header: JwtHeader; payload: JwtPayload } {
    if (isTokenBlacklisted(token)) {
      throw new Error("This token is blacklisted");
    }

    const [headerEncoded, payloadEncoded, signatureEncoded] = token.split(".");

    const signatureToVerify = sign(
      `${headerEncoded}.${payloadEncoded}`,
      secret
    );
    const signatureToVerifyEncoded = base64UrlEncode(signatureToVerify);

    if (signatureToVerifyEncoded !== signatureEncoded) {
      throw new Error("Invalid signature");
    }

    const headerJson = base64UrlDecode(headerEncoded);
    const payloadJson = base64UrlDecode(payloadEncoded);

    const header: JwtHeader = JSON.parse(headerJson);
    const payload: JwtPayload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Token expired");
    }

    return { header, payload };
  }

  return {
    createJwt,
    verifyJwt,
    generateRefreshToken,
    validateRefreshToken,
    blacklistToken,
  };
};
