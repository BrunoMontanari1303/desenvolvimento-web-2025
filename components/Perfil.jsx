// 1. Componente Perfil: <Perfil nome="Ester" bio="Apaixonada por React" /> exibindo nome e bio.
// 2. Componente Perfil: Edite novamente o componente <Perfil /> 
// que recebe nome e bio por props e use estado para alternar a exibição da bio com um botão “Mostrar/Ocultar”. (Props/estado e renderização condicional.)
// 7. Lifting State para Editar Perfil: Crie dois componentes filhos com inputs (nome, descricao)
//    e botões de confirmação, mantenha o estado no pai <Perfil />, passando valores e handlers por props para atualizar o <Perfil /> aos seus componentes filhos.
//    Use classes do Bootstrap para organizar o layout. (Lifting state + props + Bootstrap.)

import { useState } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Componente Filho para Nome
const NomeInput = ({ nome, setNome }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Nome</label>
      <input
        type="text"
        className="form-control"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Digite o nome"
      />
      <Button variant="primary" onClick={() => alert(`Nome: ${nome}`)}>
        Confirmar Nome
      </Button>
    </div>
  );
};

// Componente Filho para Descrição
const DescricaoInput = ({ descricao, setDescricao }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Descrição</label>
      <input
        type="text"
        className="form-control"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Digite a descrição"
      />
      <Button variant="success" onClick={() => alert(`Descrição: ${descricao}`)}>
        Confirmar Descrição
      </Button>
    </div>
  );
};

// Componente Pai: Perfil
const Perfil = () => {
  // Estado do nome e da descrição
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  return (
    <div className="container mt-5">
      <h2>Perfil</h2>
      <div className="row">
        <div className="col-md-6">
          <NomeInput nome={nome} setNome={setNome} />
        </div>
        <div className="col-md-6">
          <DescricaoInput descricao={descricao} setDescricao={setDescricao} />
        </div>
      </div>
      <div className="mt-3">
        <h4>Resumo do Perfil</h4>
        <p><strong>Nome:</strong> {nome}</p>
        <p><strong>Descrição:</strong> {descricao}</p>
      </div>
    </div>
  );
};

export default Perfil;