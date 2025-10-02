// 4. Input Controlado de Post: Implemente um <NovoPost /> com um <input> controlado por estado que mostra, abaixo, o texto digitado.
//  (Eventos + useState.)

import { useState } from "react";

const Like = ({ curtidas, onCurtir }) => {
  return <button onClick={onCurtir}>👍 {curtidas}</button>;
};

const NovoPost = () => {
  const [texto, setTexto] = useState("");
  const [curtidas, setCurtidas] = useState(0);

  const publicar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    alert(`Publicado: ${texto}`);
    setTexto("");
  };

  const curtir = () => {
    setCurtidas(curtidas + 1);
  };

  return (
    <div>
      <form onSubmit={publicar}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva seu post aqui"
        />
        <div>
          <button type="submit">Publicar</button>
          <Like curtidas={curtidas} onCurtir={curtir} />
        </div>
      </form>
      <div>
        {}
        <h3>Texto digitado:</h3>
        <p>{texto}</p>
      </div>
    </div>
  );
};

export default NovoPost;
