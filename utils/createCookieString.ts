interface Cookie {
  name: string;
  value: string;
  expires?: string;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  unparsed?: string[];
}

function createCookieString(cookie: Cookie): string {
  if (!cookie.name) {
    return "";
  }
  const out: string[] = [];

  out.push(`${cookie.name}=${cookie.value}`);

  // Fallback for invalid Set-Cookie
  // ref: https://tools.ietf.org/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.1
  if (cookie.name.startsWith("__Secure")) {
    cookie.secure = true;
  }
  if (cookie.name.startsWith("__Host")) {
    cookie.path = "/";
    cookie.secure = true;
    delete cookie.domain;
  }

  if (cookie.secure) {
    out.push("Secure");
  }
  if (cookie.httpOnly) {
    out.push("HttpOnly");
  }
  if (typeof cookie.maxAge === "number" && Number.isInteger(cookie.maxAge)) {
    out.push(`Max-Age=${cookie.maxAge}`);
  }
  if (cookie.domain) {
    out.push(`Domain=${cookie.domain}`);
  }
  if (cookie.sameSite) {
    out.push(`SameSite=${cookie.sameSite}`);
  }
  if (cookie.path) {
    out.push(`Path=${cookie.path}`);
  }
  if (cookie.expires) {
    out.push(`Expires=${cookie.expires}`);
  }
  if (cookie.unparsed) {
    out.push(cookie.unparsed.join("; "));
  }
  return out.join("; ");
}

export default createCookieString;