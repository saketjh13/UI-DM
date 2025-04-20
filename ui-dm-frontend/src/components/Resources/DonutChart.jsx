import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ data }) => {
  const labels = data.map(item => item.resource);
  const values = data.map(item => item.availableQuantity);

  const generateColors = (count) => {
    const baseColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    while (baseColors.length < count) {
      baseColors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return baseColors.slice(0, count);
  };

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: generateColors(labels.length),
        borderWidth: 1
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right'
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = chartData.labels[tooltipItem.dataIndex];
            const value = chartData.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DonutChart;
