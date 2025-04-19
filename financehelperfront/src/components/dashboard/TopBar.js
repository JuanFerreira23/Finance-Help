import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const TopBar = () => {
  return (
    <Navbar bg="white" className="shadow-sm mb-3">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-primary fs-4">Dashboard</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default TopBar;
