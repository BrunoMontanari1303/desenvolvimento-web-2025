import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import usuarioRoutes from './routes/usuario.routes.js'
import veiculoRoutes from './routes/veiculo.routes.js'
import motoristaRoutes from './routes/motorista.routes.js'
import pedidoRoutes from './routes/pedido.routes.js'
import authRoutes from './routes/auth.routes.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { ensureAuth } from './middlewares/authMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const app = express();
app.use(express.json({ limit: '1mb' })); 

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))


app.use('/auth', authRoutes)

app.use('/usuarios', ensureAuth(['ADMIN']), usuarioRoutes)
app.use('/veiculos', ensureAuth(['ADMIN', 'GESTOR']), veiculoRoutes)
app.use('/motoristas', ensureAuth(['ADMIN', 'GESTOR']), motoristaRoutes)
app.use('/pedidos', ensureAuth(), pedidoRoutes)

// Definir o diretório de views (páginas HTML)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Página de erro 404 - Não encontrado
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Rota não encontrada' })
})

const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor',
  })
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));