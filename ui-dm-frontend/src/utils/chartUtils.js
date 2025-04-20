// src/utils/chartUtils.js

// Example function for preparing chart data
export const prepareChartData = (resources, category) => {
  // Example logic to return chart data based on the resources and category
  return {
    barChartData: {
      labels: ['Available', 'Requested'],
      datasets: [
        {
          label: `${category} Data`,
          data: [
            resources.totalAvailable || 0,
            resources.totalRequested || 0,
          ],
          backgroundColor: '#4BC0C0', // Example color
        },
      ],
    },
    donutChartData: {
      labels: ['Available', 'Requested'],
      datasets: [
        {
          data: [
            resources.totalAvailable || 0,
            resources.totalRequested || 0,
          ],
          backgroundColor: ['#FF6384', '#36A2EB'], // Example colors
        },
      ],
    },
    items: resources.items || [], // Assuming items are inside resources
    totalAvailable: resources.totalAvailable || 0,
    totalRequested: resources.totalRequested || 0,
    totalShortage: resources.totalShortage || 0,
  };
};
