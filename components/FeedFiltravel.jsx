//6. Feed filtrável: filtre por conteúdo e por autor (dois campos). 
// Além disso, adicione mais dados no array posts.

import { useState } from "react";

const Filtro = ({ termoState, setTermoState }) => {
  return (
    <input
      placeholder="Filtrar por autor ou conteúdo..."
      value={termoState}
      onChange={e => setTermoState(e.target.value)}
    />
  );
};

const Lista = ({ posts, termoState }) => {
  const filtro = posts.filter(post =>
    post.autor.toLowerCase().includes(termoState.toLowerCase()) ||
    post.texto.toLowerCase().includes(termoState.toLowerCase())
  );

  return filtro.map(post => (
    <div key={post.id}>
      <strong>{post.autor}</strong> ({post.data}): {post.texto}
    </div>
  ));
};

const FeedFiltravel = () => {
  const [termoState, setTermoState] = useState("");

  const posts = [
    { id: 1, autor: "Zé", texto: "JSX ❤️", data: "2025-09-01", categoria: "React", curtidas: 3 },
    { id: 2, autor: "Bruno", texto: "Hooks são poderosos", data: "2025-09-02", categoria: "React", curtidas: 5 },    { id: 4, autor: "Carlos", texto: "JavaScript é o futuro", data: "2025-09-04", categoria: "JavaScript", curtidas: 10 },
    { id: 5, autor: "Marta", texto: "Node.js é incrível", data: "2025-09-05", categoria: "Backend", curtidas: 6 },
    { id: 6, autor: "Bruno", texto: "Estado é importante", data: "2025-09-06", categoria: "React", curtidas: 2 }
  ];

  return (
    <>
      <Filtro termoState={termoState} setTermoState={setTermoState} />
      <Lista posts={posts} termoState={termoState} />
    </>
  );
};

export default FeedFiltravel;
