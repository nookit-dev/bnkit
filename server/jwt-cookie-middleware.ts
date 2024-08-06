import { jwtBack } from "../jwt";
import { createServerCookieFactory } from "../cookies";
import type { Middleware } from "./middleware-types";
import type { JwtPayload } from "../jwt/jwt-types";

export interface JwtCookieMiddlewareOptions<T extends object> {
	cookieName: string;
	jwtSecret: string;
	cookieOptions?: Parameters<
		ReturnType<typeof createServerCookieFactory>["setCookie"]
	>[1]["options"];
}

export const jwtCookieMiddleware = <T extends object>(
	options: JwtCookieMiddlewareOptions<T>,
): Middleware<T | null> => {
	const { cookieName, jwtSecret, cookieOptions } = options;
	const cookieFactory = createServerCookieFactory(cookieName);
	const jwtFactory = jwtBack({ factorySignSecret: jwtSecret });

	return async (request, next) => {
		const cookieValue = cookieFactory.getRawCookie(request);
		let jwtData: T | null = null;

		if (cookieValue) {
			try {
				const { payload } = await jwtFactory.verifyJwt(cookieValue);
				jwtData = payload as T;
			} catch (error) {
				// Invalid or expired token, clear the cookie
				cookieFactory.deleteCookie(new Response());
			}
		}

		await next();

		return jwtData;
	};
};

export const setJwtCookie = <T extends object>(
	options: JwtCookieMiddlewareOptions<T>,
	data: T,
	response: Response,
): void => {
	const { cookieName, jwtSecret, cookieOptions } = options;
	const cookieFactory = createServerCookieFactory(cookieName);
	const jwtFactory = jwtBack({ factorySignSecret: jwtSecret });

	const token = jwtFactory.createJwt({ payload: data as JwtPayload<T> });
	cookieFactory.setCookie(token, { res: response, options: cookieOptions });
};

export const clearJwtCookie = (
	options: JwtCookieMiddlewareOptions<any>,
	response: Response,
): void => {
	const { cookieName } = options;
	const cookieFactory = createServerCookieFactory(cookieName);
	cookieFactory.deleteCookie(response);
};
