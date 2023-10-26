export interface JwtHeader {
  alg: string;
  typ: string;
}

export interface JwtPayload {
  exp?: number;
  roles?: string[];
  [key: string]: any;
}

export interface RefreshToken {
  token: string;
  exp: number;
}
