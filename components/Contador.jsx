// 3. Contador com passo: adicione um <input type="number"> para mudar a quantidade de incremento/decremento.

import { useState } from 'react'
const Contador = () => {
    const [valor, setValor] = useState(0); // Criando um estado
    const diminuir = () => {
        setValor( valor - 1 );
    }
    const incrementar = () => {
        setValor( valor + 1 );
    }
    return (
        <div>           
            <input type="number" />
        </div>
    )
}
export default Contador
