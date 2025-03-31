'use client'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingData {
  place: string;
  totalAmount: number;
}

export default function SpendingPieChart({ data }: { data: SpendingData[] }) {
  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.place),
    datasets: [
      {
        data: data.map(item => item.totalAmount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: R${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
}