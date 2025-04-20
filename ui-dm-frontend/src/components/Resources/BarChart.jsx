import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  // fallback to empty array if data isn't passed
  const validData = data || [];
  console.log(data);
  const chartData = {
    labels: validData.map(item => item.resource),
    datasets: [
      {
        label: 'Available Quantity',
        data: validData.map(item => item.availableQuantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderRadius: 6
      },
      {
        label: 'Requested Quantity',
        data: validData.map(item => item.requestedQuantity),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Item-wise Resource Breakdown'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default BarChart;
