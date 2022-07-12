/** @jsx h */
import { h, Fragment } from "preact";
import { useMemo } from "preact/hooks";
import { tw } from "@twind";
import { PageProps, Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Mortgage, Frame } from "../data/data.ts";
import Container from "../components/container.tsx"
import Stats from "../components/stats.tsx"
import Table from "../islands/table.tsx"
import Timeline from '../app/timeline.ts';

function Details(props: PageProps) {
  const {
    timeline,
    regularTimeline,
  } = useMemo(() => {
    const timeline = new Timeline(props.data.mortgage, props.data.frames);
    return {
      timeline: timeline.getMonths(),
      regularTimeline: timeline.getRegularMonths(),
    }
  }, []);
  
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
      <Stats timeline={timeline} mortgage={props.data.mortgage} regularTimeline={regularTimeline} />
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

    const mortgages = await Mortgage.all();

    return ctx.render({ mortgages, mortgage, frames: frames });
  },
  POST: async (request, ctx) => {
    const mortgageId = ctx.params.id;
    const data = await request.formData();

    switch (data.get("action")) {
      case "delete": {
        const frame = await Frame.where({
          interval: Number(data.get("interval")),
          mortgage_id: Number(mortgageId)
        }).first();
        await frame.delete();
        break;
      }
      case "post": {
        let frame = await Frame.where({
          interval: Number(data.get("interval")),
          mortgage_id: Number(mortgageId)
        }).first()

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

        break;
      }
    }
//
//
    // just assume its fine lmaoo

    return await handler.GET(request, ctx)
  },
};

export default Details;