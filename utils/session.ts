import { getCookies } from "https://deno.land/std@0.146.0/http/cookie.ts";
import { Session } from "../data/data.ts";
import envConfig from '../config.ts';
import createCookieString from "./createCookieString.ts";
import sessionGenerator from "./sessionGenerator.ts";

export const logout = async (request) => {
  const url = new URL(request.url);
  const cookies = getCookies(request.headers);

  if(cookies._session) {
    const session = await Session.select("id").find(cookies._session);
    if (session) {
      await session.delete();
    }
  }

  const response = new Response("", { status: 302 });
  response.headers.set("Set-Cookie", createCookieString({
    httpOnly: true,
    value: "",
    expires: new Date(1970, 1, 1).toUTCString(),
    name: "_session",
    domain: envConfig.hostname
  }));
  response.headers.set("Location", "/unlock")

  return response;
}

export const login = async (request) => {
  const url = new URL(request.url);
  const sessionId = sessionGenerator(100);

  const session = new Session();
  session.id = sessionId;
  await session.save();

  const response = new Response(null, { status: 302 });

  response.headers.set("Set-Cookie", createCookieString({
    name: "_session",
    value: sessionId,
    httpOnly: true,
    domain: envConfig.hostname,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()
  }));

  response.headers.set("Location", "/");

  return response;
}