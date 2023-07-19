import crypto from "crypto";

export const jwtClientFactory = () => {
  function decodeJwt(token: string) {
    const [headerEncoded, payloadEncoded] = token.split(".");
    const headerJson = Buffer.from(headerEncoded, "base64").toString();
    const payloadJson = Buffer.from(payloadEncoded, "base64").toString();

    return {
      header: JSON.parse(headerJson),
      payload: JSON.parse(payloadJson),
    };
  }

  return {
    decodeJwt,
    isJwtExpired(token: string) {
      const { payload } = decodeJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp && payload.exp < currentTime;
    },
  };
};

interface JwtHeader {
  alg: string;
  typ: string;
}

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export const jwtServerFactory = (secret: string) => {
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
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    return hmac.digest("base64");
  }

  function createJwt(
    payload: JwtPayload,
    secret: string,
    expiresIn: number = 60 * 60
  ): string {
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
    secret: string
  ): { header: JwtHeader; payload: JwtPayload } {
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
  };
};
