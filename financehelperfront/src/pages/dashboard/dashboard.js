import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/dashboard/SideBar';
import Topbar from '../../components/dashboard/TopBar';
import MetricCard from '../../components/dashboard/MetricCard';
import ChartCard from '../../components/dashboard/ChartCard';
import GastosSection from '../../components/dashboard/GastosSection';


const Dashboard = () => {
  const [custos, setCustos] = useState([]);

  const handleAddCusto = (novoCusto) => {
    setCustos([...custos, novoCusto]);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Topbar />
        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col md={4}><MetricCard title="Quantidade de Gasto Mensais" value="281" color="primary" /></Col>
            <Col md={4}><MetricCard title="Média Diaria" value="2,300" color="success" /></Col>
            <Col md={4}><MetricCard title="Receita" value="$34k" color="warning" /></Col>
          </Row>
          <Row className="mb-4">
            <Col md={6}><ChartCard title="Gastos Mensais" /></Col>
            <Col md={6}><ChartCard title="Gastos Anuais" /></Col>
          </Row>
          <Row>
            <Col>
              <GastosSection />
            </Col>
          </Row>
          
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
