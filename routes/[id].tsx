/** @jsx h */
import { h, Fragment } from "preact";
import { tw } from "@twind";
import { PageProps, Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Mortgage, Frame } from "../data/data.ts";
import Container from "../components/container.tsx"
// import UsageGraph from "../islands/chart.tsx"
import Table from "../islands/table.tsx"
import createMortgageTimeline from '../app/timeline.ts';

const Stats = ({ mortgage, timeline }) => {
  const timeDifference = timeline[timeline.length - 1].time - mortgage.start;
  const progress = new Date().getTime() - mortgage.start;

  const percent = progress / timeDifference;

  let remaining = timeDifference - progress;

  const unixYear = (1000 * 60 * 60 * 24 * 365);
  const unixMonth = unixYear / 12;

  const years = Math.floor(remaining / unixYear);
  remaining -= years * unixYear;
  const months = Math.floor(remaining / unixMonth);

  return (
    <Fragment>
      <div className={tw`w-full border mb-4`}>
        {/* <UsageGraph /> */}
      </div>
      <div className={tw`grid grid-cols-3 gap-4 mb-4`}>
        <div className={tw`w-full border border-red-500 py-3 px-4`}>
          <h2 className={tw`uppercase text-lg font-bold border-b mb-2`}>
            Time Remaining
          </h2>
          <p className={tw`text-2xl`}>
            {years} years, {months} months
          </p>
        </div>
        <div className={tw`w-full border border-green-500 py-3 px-4`}>
          <h2 className={tw`uppercase text-lg font-bold border-b mb-2`}>
            Predicted Total Spent
          </h2>
          <p className={tw`text-2xl`}>
            £{timeline.reduce((acc: number, item: any) => {
              return acc + item.overpayment.one_time + item.overpayment.recurring + item.base_payment
            }, 0).toFixed(2)}
          </p>
        </div>
        <div className={tw`w-full border border-blue-500 py-3 px-4`}>
          <h2 className={tw`uppercase text-lg font-bold border-b mb-2`}>
            Predicted Interest Accumulated
          </h2>
          <p className={tw`text-2xl`}>
            £{timeline.reduce((acc: number, item: any) => {
              return acc + item.interest_paid
            }, 0).toFixed(2)}
          </p>
        </div>
      </div>
      <div className={tw`flex gap-4 mb-4 items-center`}>
        <span className={tw`font-bold`}>
          {(percent * 100).toFixed(2)}%
        </span>
        <div className={tw`border border-white w-full`}>

          <div style={{ width: `${percent * 100}%` }} className={tw`h-8  bg-white`}></div>
        </div>
      </div>
    </Fragment>
  )
}

export default function Details(props: PageProps) {
  const timeline = createMortgageTimeline(props.data.mortgage, props.data.frames);

  return (
    <Container mortgages={props.data.mortgages} currentMortgage={props.data.mortgage.id}>
      <Head>
        <script>{`
          if ( window.history.replaceState ) {
            window.history.replaceState( null, null, window.location.href );
          }
        `}</script>
        <link rel="stylesheet" href="/base.css" />
      </Head>
      <Stats timeline={timeline} mortgage={props.data.mortgage} />
      <Table timeline={timeline} />
    </Container>
  );
}

export const handler: Handlers<any | null> = {
  GET: async (_, ctx) => {
    const mortgageId = ctx.params.id;

    const mortgage = await Mortgage.select("*").find(mortgageId)
    if(!mortgage) {
      return new Response("Not found", { status: 404 });
    }

    const frames = await Frame
      .select("*")
      .where("mortgage_id", mortgageId)
      .orderBy("interval")
      .get()

    console.log(frames)
    const mortgages = await Mortgage.all();

    return ctx.render({ mortgages, mortgage, frames: frames });
  },
  POST: async (request, ctx) => {
    const mortgageId = ctx.params.id;
    const data = await request.formData();
//
//
    // just assume its fine lmaoo
    let frame = await Frame.where({
      interval: Number(data.get("interval")),
      mortgage_id: Number(mortgageId)
    }).first()

    console.log(mortgageId)

    const target_interest_rate = data.get("interest_rate") ? Number(data.get("interest_rate")) : undefined;
    const target_overpayment_singular = data.get("single_overpayment") ? Number(data.get("single_overpayment")) : undefined;
    const target_overpayment_regular = data.get("regular_overpayment") ? Number(data.get("regular_overpayment")) : undefined;

    if(!frame) {
      await Frame.create({
        mortgageId: mortgageId,
        interest_rate: target_interest_rate,
        overpayment_recurring: target_overpayment_regular,
        overpayment_onetime: target_overpayment_singular,
        interval: Number(data.get("interval")),
      });
    } else {
      await Frame.where({
        interval: Number(data.get("interval")),
        mortgage_id: Number(mortgageId)
      }).update({
        interest_rate: target_interest_rate,
        overpayment_recurring: target_overpayment_regular,
        overpayment_onetime: target_overpayment_singular
      })
    }

    return await handler.GET(request, ctx)
  },
};