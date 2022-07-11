/** @jsx h */
import { h } from "preact";
import charts from 'https://esm.sh/v86/precharts@1.4.0/deno/precharts.js';

const { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } = charts;

const UsageGraph = () => {
  const data = [
    { balance: 1 },
    { balance: 2 },
    { balance: 1 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={300} height={100} data={data} margin={{ top: 30, left: 0, right: 40, bottom: 15 }}>
        <Tooltip
          contentStyle={{ border: '1px solid white' }}
          separator=": "
        />
        <XAxis dataKey="name" axisLine={false} padding={{ left: 5 }} style={{ fontSize: '0.8rem' }} />
        <YAxis axisLine={false} unit={"£"} padding={{ bottom: 5 }} style={{ fontSize: '0.8rem' }} />

        <Area type="monotone" dataKey="balance" stroke="#ffffff" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UsageGraph;