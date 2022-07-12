/** @jsx h */
import { h, Fragment } from "preact";
import { tw } from "@twind";
import UsageGraph from "../islands/chart.tsx";

const Stats = ({ mortgage, timeline, regularTimeline }) => {
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
        <UsageGraph timeline={timeline} regularTimeline={regularTimeline}/>
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
              return acc + item.applied.overpayment.onetime + item.applied.overpayment.recurring + item.base_payment
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

export default Stats;