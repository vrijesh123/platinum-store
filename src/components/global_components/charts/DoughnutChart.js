import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart(props) {
  return <Doughnut data={props?.data} options={props?.options} />;
}

export default DoughnutChart;