import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      display: false,
    },
    title: {
      display: true,
      text: 'Probability scale',
    },
  },
};
const labels = [
  'identity hate',
  'insult',
  'neutral',
  'obscene',
  'threat',
  'toxic',
];
// const data = {
//   labels,
//   datasets: [
//     {
//       label: '',
//       data: [0.1, 0.2, 0.3, 0.1, 0.2, 0.1],
//       borderColor: 'rgba(255, 99, 132, 1)',
//       //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
//       borderWidth: 2,
//       borderRadius: 5,
//       borderSkipped: false,
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//   ],
// };

const ClassProb = ({ probs }) => {
  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: [0.1, 0.2, 0.3, 0.1, 0.2, 0.1],
        borderColor: 'rgba(255, 99, 132, 1)',
        //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  if (probs) {
    console.log(probs);
    data.datasets[0].data = probs;
  }
  return (
    <>
      <Bar options={options} data={data} />
    </>
  );
};

export default ClassProb;
