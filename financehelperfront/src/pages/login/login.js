import { useState } from "react";
import { Container, Nav, Tab, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/logo1.png";
import "./login.css";
import { login, saveTokens } from "../../services/loginService";
import axios from "axios";

const Login = () => {
  const [key, setKey] = useState("login");

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Register states
  const [nome, setNome] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }
  
    try {
      const response = await login(email, password);
  
      // Exibe no console toda a resposta igual ao Swagger
      console.log("Resposta do login:", response);
  
      const { accessToken, refreshToken } = response.dados;
  
      if (!accessToken || !refreshToken) {
        throw new Error("Usuário ou senha inválidos!");
      }
  
      saveTokens({ accessToken, refreshToken });
    } catch (err) {
      console.error("Erro ao tentar fazer login:", err);
      setError(err.message || "Falha no login");
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nome || !registerEmail || !registerPassword || !telefone) {
      setRegisterError("Preencha todos os campos!");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7219/api/Usuario", {
        nome,
        email: registerEmail,
        senha: registerPassword,
        telefone,
      });

      if (response.data.sucesso) {
        setRegisterSuccess("Cadastro realizado com sucesso!");
        setRegisterError("");
        setNome("");
        setRegisterEmail("");
        setRegisterPassword("");
        setTelefone("");
        setKey("login"); // volta pro login
      } else {
        setRegisterError(response.data.mensagem || "Erro ao registrar.");
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setRegisterError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow-lg rounded bg-white" style={{ width: "500px" }}>
        <img src={logo} alt="Finance Helper Logo" className="logo mb-3" />
        <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
          <Nav variant="pills" className="nav-justified mb-3">
            <Nav.Item>
              <Nav.Link eventKey="login">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="register">Register</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="login">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-1">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <div className="d-flex justify-content-between mb-3">
                  <Form.Check label="Remember me" />
                  <a href="#!">Forgot password?</a>
                </div>
                <Button variant="primary" type="submit" className="w-100">
                  Sign in
                </Button>
              </Form>
            </Tab.Pane>

            <Tab.Pane eventKey="register">
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-2">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Seu email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Crie uma senha"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="(XX) XXXXX-XXXX"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                </Form.Group>

                {registerError && <Alert variant="danger">{registerError}</Alert>}
                {registerSuccess && <Alert variant="success">{registerSuccess}</Alert>}

                <Button variant="success" type="submit" className="w-100">
                  Cadastrar
                </Button>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Container>
  );
};

export default Login;
