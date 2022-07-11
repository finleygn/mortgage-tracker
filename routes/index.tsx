/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";

// import Mortgage from "../app/mortgage.ts";
// import createMortgageTimeline from "../app/timeline.ts";
import "../data/data.ts";
import Container from "../components/container.tsx";
import { Mortgage } from "../data/data.ts";

// const mortgages = [
//   new Mortgage(27 * 12, 95000, new Date(2022, 5, 1), {
//     frame: [{ overpayment_onetime: 0, overpayment_recurring: 0, interest_rate: 0.0263 }],
//     interval: [0]
//   }),
//   new Mortgage(27 * 12, 95000, new Date(2022, 5, 1), {
//     frame: [{ overpayment_onetime: 0, overpayment_recurring: 0, interest_rate: 0.0263 }],
//     interval: [0]
//   })
// ]

// const Table = () => {
//   mortgages[0].addFrame(0, { overpayment_onetime: 1, overpayment_recurring: 0, interest_rate: 0.0263 })

//   const timelines = mortgages.map(mortgage => createMortgageTimeline(mortgage))

//   return (
    
// }

export const handler: Handlers<any | null> = {
  async GET() {
    const mortgages = await Mortgage.all();

    if(!mortgages.length) {
      throw new Error("No mortgages set up...")
    }

    const response = new Response(null, { status: 302 });
    response.headers.set("Location", `/${mortgages[0].id}`);
    return response;
  },
};
