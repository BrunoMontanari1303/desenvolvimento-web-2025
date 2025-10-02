import express from 'express'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuario.routes.js'
import veiculoRoutes from './routes/veiculo.routes.js'
import motoristaRoutes from './routes/motorista.routes.js'
import pedidoRoutes from './routes/pedido.routes.js'

dotenv.config();

const app = express();
app.use(express.json()); 


// Routes
app.use('/usuarios', usuarioRoutes)
app.use('/veiculos', veiculoRoutes)
app.use('/motoristas', motoristaRoutes)
app.use('/pedidos', pedidoRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));