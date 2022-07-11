/** @jsx h */
import { h, Fragment } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";
import Header from './header.tsx';

const Container = ({ children, mortgages, currentMortgage }) => {
  return (
    <Fragment>
      <Head>
        <title>Mortgage Thing</title>
        <link rel="stylesheet" href="/base.css" />
      </Head>
      <Header />
      <div className={tw`container px-2 mx-auto grid grid-cols-10 items-start mt-8 gap-4`}>
        <div className={tw`col-span-2`}>
          <nav className={tw`col-span-2 w-full border border-white p-2`}>
            <h2 className={tw`font-bold mb-2`}>Select Subaccount {"->"}</h2>

            {mortgages.length ? mortgages.map((mortgage: any) => (
              <a href={`/${mortgage.id}`} className={tw`block`}>{mortgage.id === currentMortgage ? ">" : ""}{mortgage.name}</a>
            )) : (
              <p>No sub accounts yet</p>
            )}
          </nav>
          <img src="/gifs/3.gif" className={tw`mt-4 w-full`} />
        </div>
        
        <main className={tw`col-span-8`}>
          {children}
        </main>
      </div>
      
    </Fragment>
  )
}

export default Container;