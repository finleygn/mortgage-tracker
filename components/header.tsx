/** @jsx h */
import { h, Fragment } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";

const Header = () => {
  return (
    <div className={tw`border-b-1 border-white w-full`}>
      <div className={tw`py-6 px-2 text-white container mx-auto flex justify-between items-center`} style={{ backdropFilter: "blur(10px)" }}>
        <h1 className={tw`text-2xl`}>Mortgage Tracky</h1>
        <a href="/logout" className={tw`py-1 px-4 bg-white text-black`}>
          Lock
        </a>
      </div>
    </div>
  )
}

export default Header;