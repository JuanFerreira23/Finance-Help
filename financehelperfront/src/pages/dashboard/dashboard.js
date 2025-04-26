import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/dashboard/SideBar';
import Topbar from '../../components/dashboard/TopBar';
import MetricCard from '../../components/dashboard/MetricCard';
import ChartCard from '../../components/dashboard/ChartCard';
import GastosSection from '../../components/dashboard/GastosSection';
import axios from 'axios';

const Dashboard = () => {
  const [custos, setCustos] = useState([]);
  const [resumo, setResumo] = useState(0);

  // Buscar usuarioId do localStorage
  const usuarioId = localStorage.getItem('idUsuario');

  useEffect(() => {
    fetchCustos();
    fetchResumoMensal();
  }, []);

  const fetchCustos = async () => {
    try {
      const response = await axios.get(`https://localhost:7219/api/gasto/usuario/${usuarioId}`);
      setCustos(response.data.dados);
    } catch (error) {
      console.error('Erro ao buscar custos:', error);
    }
  };

  const fetchResumoMensal = async () => {
    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const ano = hoje.getFullYear();

    try {
      const response = await axios.get(`https://localhost:7219/api/gasto/resumo/${usuarioId}?mes=${mes}&ano=${ano}`);
      setResumo(response.data.dados);
    } catch (error) {
      console.error('Erro ao buscar resumo mensal:', error);
    }
  };

  const calcularMediaDiaria = () => {
    const hoje = new Date();
    const dia = hoje.getDate();
    return dia === 0 ? 0 : resumo / dia;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Topbar />
        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <MetricCard title="Quantidade de Gastos" value={custos.length} color="primary" />
            </Col>
            <Col md={4}>
              <MetricCard title="Média Diária" value={`R$ ${calcularMediaDiaria().toFixed(2)}`} color="success" />
            </Col>
            <Col md={4}>
              <MetricCard title="Total Mensal" value={`R$ ${resumo.toFixed(2)}`} color="warning" />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={6}>
              <ChartCard title="Gastos Mensais" data={custos} />
            </Col>
            <Col md={6}>
              <ChartCard title="Gastos Anuais" data={custos} />
            </Col>
          </Row>
          <Row>
            <Col>
              <GastosSection gastos={custos} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
