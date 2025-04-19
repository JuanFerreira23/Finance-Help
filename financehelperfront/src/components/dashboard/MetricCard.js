import React from 'react';
import { Card } from 'react-bootstrap';

const MetricCard = ({ title, value, color }) => {
  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body>
        <Card.Title className="text-muted fw-semibold">{title}</Card.Title>
        <h2 className={`text-${color} fw-bold`}>{value}</h2>
      </Card.Body>
    </Card>
  );
};

export default MetricCard;
