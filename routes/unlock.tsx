/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";

import Lock from "../islands/lock.tsx";
import envConfig from '../config.ts';
import { login } from "../utils/session.ts";
import createCookieString from "../utils/createCookieString.ts";
import { Session } from "../data/data.ts";

export const handler: Handlers<any | null> = {
  async POST(request, ctx) {
    const body = await request.text();
    const pw = body.split("pw=")[1];
    
    if(pw !== envConfig.password) {
      return ctx.render({ error: true });
    }

    return login(request);
  },
  async GET(request, ctx) {
    return ctx.render({ error: false });
  },
};

const randomGif = () => {
  const options = [1, 2, 3, 4, 5, 6];
  return options[Math.floor(Math.random() * options.length)];
}

const Unlock = ({ data }) => {
  return (
    <div>
      <Head>
        <script>{`
          if ( window.history.replaceState ) {
            window.history.replaceState( null, null, window.location.href );
          }
        `}</script>
        <style>{`
          html, body {
            margin: 0;
          }
          
          html {
            background: #000;
          }

          body {
            background-image: url('/gifs/${randomGif()}.gif');
            background-position: center center;
            background-size: 15vmin 15vmin;
          }
        `}</style>
      </Head>
      <div className={tw`flex h-screen w-full items-center justify-center`}>
        <Lock error={data.error} />
      </div>
    </div>
  )
}

export default Unlock;