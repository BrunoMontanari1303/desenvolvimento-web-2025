// 8. Rotas mínimas: navegue pelas rotas "/", "/sobre", "/contato" utilizando uma Navbar com links (Bootstrap/React-Bootstrap).

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Contador from "../../components/Contador";
import Feed from "../../components/Feed";
import FeedFiltravel from "../../components/FeedFiltravel";
import NovoPost from "../../components/NovoPost";
import Perfil from "../../components/perfil";
import Saudacao from "../../components/Saudacao";

// Componente Navbar
const Navigation = () => (
  <Navbar bg="dark" variant="dark" expand="lg">
    <Container>
      <Navbar.Brand as={Link} to="/">Minha Aplicação</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/feed">Feed</Nav.Link>
          <Nav.Link as={Link} to="/novo-post">Novo Post</Nav.Link>
          <Nav.Link as={Link} to="/perfil">Perfil</Nav.Link>
          <Nav.Link as={Link} to="/contador">Contador</Nav.Link>
          <Nav.Link as={Link} to="/feed-filtravel">Feed Filtravel</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

const App = () => {
  return (
    <Router>
      <Navigation /> {/* Navbar com links */}

      {/* Definindo as rotas */}
      <Routes>
        <Route path="/" element={<Saudacao nome="Esther" />} />
        <Route path="/perfil" element={<Perfil nome="Esther" bio="Apaixonada por React" />} />
        <Route path="/contador" element={<Contador />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/novo-post" element={<NovoPost />} />
        <Route path="/feed-filtravel" element={<FeedFiltravel />} />
      </Routes>
    </Router>
  );
};

export default App;
