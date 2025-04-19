import React from 'react';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartCard = ({ title }) => {
  const data = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Performance',
        data: [150, 200, 250, 220, 300, 400],
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.05)',
        tension: 0.3,
        pointBackgroundColor: '#0d6efd',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d6efd',
        titleColor: '#fff',
        bodyColor: '#fff',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 100 }
      }
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body>
        <Card.Title className="fw-semibold text-muted">{title}</Card.Title>
        <div style={{ height: '230px' }}>
          <Line data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChartCard;
