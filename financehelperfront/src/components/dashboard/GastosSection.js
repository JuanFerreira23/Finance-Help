// src/components/dashboard/GastosSection.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Table, Row, Col, Tabs, Tab, Spinner, Alert } from 'react-bootstrap';
import { fetchGastos, addGasto } from '../../services/apiService';

const categorias = ['Alimentação', 'Transporte', 'Lazer', 'Educação', 'Outros'];

const GastosSection = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [novoGasto, setNovoGasto] = useState({ titulo: '', valor: '', categoria: '', data: '' });
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroMesAno, setFiltroMesAno] = useState('');

  useEffect(() => {
    carregarGastos();
  }, []);

  const carregarGastos = async () => {
    try {
      const data = await fetchGastos();
      setGastos(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar gastos.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNovoGasto({ ...novoGasto, [e.target.name]: e.target.value });
  };

  const handleAdicionar = async () => {
    const { titulo, valor, categoria, data } = novoGasto;
    if (!titulo || !valor || !categoria || !data) return;
    
    try {
      const gastoAdicionado = await addGasto({ ...novoGasto, valor: parseFloat(valor) });
      setGastos(prev => [...prev, gastoAdicionado]);
      setNovoGasto({ titulo: '', valor: '', categoria: '', data: '' });
    } catch (err) {
      console.error(err);
      setError("Erro ao adicionar gasto.");
    }
  };

  const gastosFiltrados = gastos.filter((g) => {
    const mesmaCategoria = filtroCategoria === 'Todas' || g.categoria === filtroCategoria;
    const mesmaData = !filtroMesAno || g.data.slice(0, 7) === filtroMesAno;
    return mesmaCategoria && mesmaData;
  });

  const total = gastosFiltrados.reduce((sum, g) => sum + parseFloat(g.valor || 0), 0);

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

  return (
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <Card.Title className="mb-4">Gastos Mensais</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}

        <Tabs defaultActiveKey="add" id="gastos-tabs" className="mb-3">
          <Tab eventKey="add" title="Adicionar">
            <Form className="mb-3">
              <Row className="g-2">
                <Col md={3}>
                  <Form.Control placeholder="Título" name="titulo" value={novoGasto.titulo} onChange={handleChange} />
                </Col>
                <Col md={2}>
                  <Form.Control placeholder="Valor" name="valor" type="number" value={novoGasto.valor} onChange={handleChange} />
                </Col>
                <Col md={3}>
                  <Form.Select name="categoria" value={novoGasto.categoria} onChange={handleChange}>
                    <option value="">Categoria</option>
                    {categorias.map((c) => <option key={c}>{c}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control type="date" name="data" value={novoGasto.data} onChange={handleChange} />
                </Col>
                <Col md={2}>
                  <Button variant="primary" onClick={handleAdicionar} className="w-100">Adicionar</Button>
                </Col>
              </Row>
            </Form>
          </Tab>

          <Tab eventKey="list" title="Visualizar">
            <Row className="mb-3 g-2">
              <Col md={4}>
                <Form.Select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                  <option value="Todas">Todas Categorias</option>
                  {categorias.map((c) => <option key={c}>{c}</option>)}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control type="month" value={filtroMesAno} onChange={(e) => setFiltroMesAno(e.target.value)} />
              </Col>
            </Row>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Valor (R$)</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {gastosFiltrados.map((g, i) => (
                  <tr key={i}>
                    <td>{g.titulo}</td>
                    <td>{parseFloat(g.valor).toFixed(2)}</td>
                    <td>{g.categoria}</td>
                    <td>{g.data}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5 className="text-end mt-3">Total: R$ {total.toFixed(2)}</h5>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default GastosSection;
