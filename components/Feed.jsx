// 5. Likes por Item no Feed: No Feed, adicione um botão “Curtir” em cada post; cada item mantém seu próprio contador no estado (por id). Exiba também um total de curtidas acima da lista. 
// (Listas + estado por item.)

import { useState } from "react";

const posts = [
  { id: 1, autor: "Zé", texto: "Primeiro post!" },
  { id: 2, autor: "Bruno", texto: "React é top!" },
];

const Post = ({ post, onCurtir }) => {
  return (
    <article>
      <strong>{post.autor}</strong>
      <p>{post.texto}</p>
      <button onClick={() => onCurtir(post.id)}>Curtir 👍 {post.curtidas}</button>
    </article>
  );
};

const Feed = () => {
  const [curtidas, setCurtidas] = useState({
    1: 0, // curtidas do post com id 1
    2: 0, // curtidas do post com id 2
  });

  const totalCurtidas = Object.values(curtidas).reduce((total, cur) => total + cur, 0);

  const curtirPost = (id) => {
    setCurtidas((prevCurtidas) => ({
      ...prevCurtidas,
      [id]: prevCurtidas[id] + 1, // Incrementa a curtida do post com id específico
    }));
  };

  return (
    <div>
      <h1>Total de Curtidas: {totalCurtidas}</h1>
      {posts.map((post) => (
        <Post key={post.id} post={{ ...post, curtidas: curtidas[post.id] }} onCurtir={curtirPost} />
      ))}
    </div>
  );
};

export default Feed;
