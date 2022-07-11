import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.146.0/http/cookie.ts";
import { Session } from "../data/data.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const url = new URL(req.url);
  
  if(!url.pathname.match(/.*\.[a-zA-Z]*$/) && url.pathname !== "/unlock") {
    const cookies = getCookies(req.headers);
    if(cookies._session) {
      const sessions = await Session.where("id", cookies._session).get();
      if(sessions.length) {
        // is authed
        return ctx.next();
      }
    }
    return Response.redirect(url.origin + "/unlock", 302);
  }

  return ctx.next();
}