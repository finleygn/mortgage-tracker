/** @jsx h */
import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { tw } from "@twind";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'https://esm.sh/chart.js@3.8.0';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);
const UsageGraph = ({ timeline, regularTimeline, mortgage }) => {
  const ref = useRef();
  const data = [
    { balance: 1 },
    { balance: 2 },
    { balance: 1 },
  ]

  useEffect(() => {
    const canvas = ref.current;
    const box = canvas.getBoundingClientRect();
    canvas.width = box.width;
    canvas.height = box.height;

    const ctx = canvas.getContext("2d");

    const labels = [];
    const datasetMonths = [];
    const datasetRegularMonths = [];

    for(let i = 0; i < regularTimeline.length; i += 12) {
      const regularMonths = regularTimeline.slice(i, i + 12);
      const months = timeline.slice(i, i + 12);

      if(regularMonths.length) {
        datasetRegularMonths.push(regularMonths[0].balance.start);
      }

      if(months.length) {
        datasetMonths.push(months[0].balance.start);
      }

      labels.push(Math.floor(i / 12));
    }

    datasetRegularMonths.push(0);
    datasetMonths.push(0);
    labels.push(labels.length);

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => "Year " + l),
            datasets: [{
                label: 'No Overpayments',
                data: datasetRegularMonths,
                borderColor: "#4ade80",
                backgroundColor: "#4ade80"
            },{
                label: 'Overpayments',
                data: datasetMonths,
                borderColor: "#60a5fa",
                backgroundColor: "#60a5fa"
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }, [])

  return (
    <div style={{ position: "relative", paddingBottom: '34.5%', height: 0 }}>
      <canvas ref={ref} style={{  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}/>
    </div>
  );
};

export default UsageGraph;