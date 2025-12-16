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
import {
  updateUsuarioAtualController,
  getUsuarioSelfOrAdminController,
  updateUsuarioSelfOrAdminController,
} from './controllers/usuarioController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const helmet = require('helmet');
const app = express();
app.use(express.json({ limit: '1mb' })); 

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],   // Permite carregar recursos apenas do mesmo domínio
      scriptSrc: ["'self'"],  // Permite scripts do mesmo domínio
      styleSrc: ["'self'", "https://fonts.googleapis.com"],  // Permite estilos do mesmo domínio
      connectSrc: ["'self'", "https://backenddevweb.onrender.com", "https://logix-rho.vercel.app"],  // Permite conexões API do mesmo domínio e os urls no ar
      fontSrc: ["'self'", "https://fonts.gstatic.com"],  // Permite fontes do Google Fonts
      objectSrc: ["'none'"],  // Não permite carregamento de objetos ou Flash
      childSrc: ["'none'"],   // Não permite janelas pop-up ou iframes
      formAction: ["'self'"], // Permite formulários apenas no mesmo domínio
      frameAncestors: ["'none'"], // Impede que a página seja incorporada em iframes
    },
  })
);

app.use('/auth', authRoutes)

app.patch('/me', ensureAuth(), updateUsuarioAtualController)

const onlyNumericId = (req, res, next) => {
  if (/^\d+$/.test(String(req.params.id))) return next()
  return next('route')
}

app.get('/usuarios/:id', ensureAuth(), onlyNumericId, getUsuarioSelfOrAdminController)
app.patch('/usuarios/:id', ensureAuth(), onlyNumericId, updateUsuarioSelfOrAdminController)

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