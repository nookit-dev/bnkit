declare var document: {
  cookie: any;
};

export const parseCookieData = <T = string>(data: string | null): T | null => {
  if (data === null) return null;

  try {
    return JSON.parse(data) as T;
  } catch (e) {
    // If parsing fails, assume the data is a string
    return data as unknown as T;
  }
};

export const stringifyCookieData = <T>(data: T): string => {
  if (typeof data === "string") {
    return data;
  } else {
    return JSON.stringify(data);
  }
};

export const retrieveRawCookieValue = (name: string): string | null => {
  const cookieArr = document.cookie.split("; ");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");
    if (name === decodeURIComponent(cookiePair[0])) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
};
