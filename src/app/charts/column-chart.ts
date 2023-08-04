export const columnChartOptions: any = {
  accessibility: {
    enabled: false,
  },
  chart: {
    type: 'column',
  },
  title: {
    text: 'Monthly Revenue',
  },
  subtitle: {
    text: 'Hotel Reveneue',
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yAxis: {
    title: { text: 'Revenue' },
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  series: [
    {
      name: 'Revenue',
      data: [],
    },
  ],
};
